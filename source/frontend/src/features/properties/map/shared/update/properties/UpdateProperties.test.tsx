import { act, screen, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SideBarContextProvider } from 'features/properties/map/context/sidebarContext';
import { mockLookups } from 'mocks/lookups.mock';
import { getMockResearchFile } from 'mocks/researchFile.mock';
import { lookupCodesSlice } from 'store/slices/lookupCodes';
import { fillInput, render, RenderOptions, userEvent } from 'utils/test-utils';

import UpdateProperties, { IUpdatePropertiesProps } from './UpdateProperties';

const mockAxios = new MockAdapter(axios);
jest.mock('@react-keycloak/web');

// Need to mock this library for unit tests
jest.mock('react-visibility-sensor', () => {
  return jest.fn().mockImplementation(({ children }) => {
    if (children instanceof Function) {
      return children({ isVisible: true });
    }
    return children;
  });
});

const setIsShowingPropertySelector = jest.fn();
const onSuccess = jest.fn();
const updateFileProperties = jest.fn();

describe('UpdateProperties component', () => {
  // render component under test
  const setup = (props: Partial<IUpdatePropertiesProps>, renderOptions: RenderOptions = {}) => {
    const utils = render(
      <SideBarContextProvider>
        <UpdateProperties
          file={props.file ?? getMockResearchFile()}
          setIsShowingPropertySelector={setIsShowingPropertySelector}
          onSuccess={onSuccess}
          updateFileProperties={updateFileProperties}
          canRemove={props.canRemove ?? jest.fn()}
          formikRef={{} as any}
        />
      </SideBarContextProvider>,
      {
        ...renderOptions,
        claims: [],
        store: {
          [lookupCodesSlice.name]: { lookupCodes: mockLookups },
        },
      },
    );

    return {
      ...utils,
    };
  };

  beforeEach(() => {
    mockAxios.resetHistory();
    mockAxios.onGet().reply(200, getMockResearchFile());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders as expected', async () => {
    setup({});
    expect(document.body).toMatchSnapshot();
  });

  it('renders a row with an address', async () => {
    const { getByText } = setup({
      file: {
        ...getMockResearchFile(),
        fileProperties: [
          {
            id: 3,
            isDisabled: false,
            propertyId: 443,
            property: {
              id: 443,
              anomalies: [],
              tenures: [],
              roadTypes: [],
              adjacentLands: [],
              region: {
                id: 1,
                description: 'South Coast Region',
                isDisabled: false,
              },
              district: {
                id: 2,
                description: 'Vancouver Island District',
                isDisabled: false,
              },
              dataSourceEffectiveDate: '2022-10-05T00:00:00',
              isSensitive: false,
              isRwyBeltDomPatent: false,
              address: {
                id: 1,
                streetAddress1: '45 - 904 Hollywood Crescent',
                streetAddress2: 'Living in a van',
                streetAddress3: 'Down by the River',
                municipality: 'Hollywood North',
                postal: 'V6Z 5G7',
                rowVersion: 2,
              },
              isOwned: false,
              isVisibleToOtherAgencies: false,
              landArea: 0,
              isVolumetricParcel: false,
              rowVersion: 3,
            },
            rowVersion: 1,
          },
        ],
      },
    });
    expect(getByText(/Address: 45 - 904 Ho/)).toBeVisible();
  });

  it('save button displays modal', async () => {
    const { getByText } = setup({});
    const saveButton = getByText('Save');
    act(() => userEvent.click(saveButton));

    expect(
      await screen.findByText(/You have made changes to the properties in this file./),
    ).toBeVisible();
  });

  it('saving and confirming the modal saves the properties', async () => {
    updateFileProperties.mockResolvedValue(getMockResearchFile());
    const { getByText } = setup({});
    const saveButton = getByText('Save');
    act(() => userEvent.click(saveButton));

    const saveConfirmButton = await screen.findByTitle('ok-modal');
    act(() => userEvent.click(saveConfirmButton));

    await waitFor(() => {
      expect(updateFileProperties).toHaveBeenCalled();
      expect(setIsShowingPropertySelector).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('if the update fails with a 409 the associated entities modal is displayed', async () => {
    updateFileProperties.mockRejectedValue({
      isAxiosError: true,
      code: '409',
    } as Partial<AxiosError>);
    const { getByText } = setup({});
    const saveButton = getByText('Save');
    act(() => userEvent.click(saveButton));

    const saveConfirmButton = await screen.findByTitle('ok-modal');
    act(() => userEvent.click(saveConfirmButton));

    await waitFor(() => {
      expect(updateFileProperties).toHaveBeenCalled();
      expect(screen.getByText('Property with associations'));
    });
  });

  it('cancel button cancels component if no actions taken', async () => {
    const { getByText } = setup({});
    const cancelButton = getByText('Cancel');
    act(() => userEvent.click(cancelButton));

    expect(setIsShowingPropertySelector).toHaveBeenCalledWith(false);
  });

  it('cancel button displays modal', async () => {
    const { getByText, container } = setup({});

    await fillInput(container, 'properties.0.name', 'test property name');

    const cancelButton = getByText('Cancel');
    await act(async () => userEvent.click(cancelButton));

    expect(
      await screen.findByText(/If you cancel now, this file will not be saved./),
    ).toBeVisible();
  });

  it('cancelling and confirming the modal hides this component', async () => {
    updateFileProperties.mockResolvedValue(getMockResearchFile());
    const { getByText, container } = setup({});

    await fillInput(container, 'properties.0.name', 'test property name');

    const saveButton = getByText('Save');
    await act(async () => userEvent.click(saveButton));

    const cancelConfirmButton = await screen.findByTitle('ok-modal');
    await act(async () => userEvent.click(cancelConfirmButton));

    await waitFor(() => {
      expect(updateFileProperties).toHaveBeenCalled();
      expect(setIsShowingPropertySelector).toHaveBeenCalledWith(false);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('removes property index if canRemove returns true', async () => {
    updateFileProperties.mockResolvedValue(getMockResearchFile());
    const canRemove = jest.fn().mockResolvedValue(true);
    const { getByTestId, getByText } = setup({ canRemove });

    const removeButton = getByTestId('remove-button');
    await act(async () => userEvent.click(removeButton));

    await waitFor(() => {
      expect(canRemove).toHaveBeenCalled();
      expect(getByText('No Properties selected'));
    });
  });

  it('displays warning modal if canRemove returns false', async () => {
    updateFileProperties.mockResolvedValue(getMockResearchFile());
    const canRemove = jest.fn().mockResolvedValue(false);
    const { getByTestId } = setup({ canRemove });

    const removeButton = getByTestId('remove-button');
    await act(async () => userEvent.click(removeButton));

    await waitFor(() => {
      expect(canRemove).toHaveBeenCalled();
      expect(screen.getByText('Property with associations'));
    });
  });
});
