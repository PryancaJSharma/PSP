import { ReactComponent as Fence } from 'assets/images/fence.svg';
import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import { MapStateContext } from 'components/maps/providers/MapStateContext';
import { IMapProperty } from 'components/propertySelector/models';
import MapSideBarLayout from 'features/mapSideBar/layout/MapSideBarLayout';
import SidebarFooter from 'features/properties/map/shared/SidebarFooter';
import { FormikHelpers, FormikProps } from 'formik';
import useApiUserOverride from 'hooks/useApiUserOverride';
import { useInitialMapSelectorProperties } from 'hooks/useInitialMapSelectorProperties';
import { UserOverrideCode } from 'models/api/UserOverrideCode';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { mapFeatureToProperty } from 'utils/mapPropertyUtils';

import { useAddLease } from '../hooks/useAddLease';
import { LeaseFormModel } from '../models';
import AddLeaseForm from './AddLeaseForm';

export interface IAddLeaseContainerProps {
  onClose: () => void;
}

export const AddLeaseContainer: React.FunctionComponent<
  React.PropsWithChildren<IAddLeaseContainerProps>
> = props => {
  const history = useHistory();
  const formikRef = useRef<FormikProps<LeaseFormModel>>(null);
  const { selectedFileFeature } = React.useContext(MapStateContext);
  const withUserOverride = useApiUserOverride('Failed to save Lease File');
  const { addLease } = useAddLease();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { search } = useMapSearch();

  const initialProperty = useMemo<IMapProperty | null>(() => {
    if (selectedFileFeature) {
      return mapFeatureToProperty(selectedFileFeature);
    }
    return null;
  }, [selectedFileFeature]);
  const { initialProperty: initialFormProperty, bcaLoading } =
    useInitialMapSelectorProperties(selectedFileFeature);
  if (!!initialProperty && !!initialFormProperty) {
    initialProperty.address = initialFormProperty?.formattedAddress;
  }

  const saveLeaseFile = async (
    leaseFormModel: LeaseFormModel,
    formikHelpers: FormikHelpers<LeaseFormModel>,
    userOverrideCodes: UserOverrideCode[],
  ) => {
    const leaseApi = leaseFormModel.toApi();
    const response = await addLease.execute(leaseApi, userOverrideCodes);
    formikHelpers.setSubmitting(false);
    if (!!response?.id) {
      if (leaseApi.properties?.find(p => !p.property?.address && !p.property?.id)) {
        toast.warn(
          'Address could not be retrieved for this property, it will have to be provided manually in property details tab',
          { autoClose: 15000 },
        );
      }
      await search();
      history.replace(`/mapview/sidebar/lease/${response.id}`);
    }
  };

  const handleSave = () => {
    const isFormValid = formikRef?.current?.isValid;

    if (!isFormValid) {
      setErrorMessage('Please check the required fields.');
    }

    if (isFormValid) {
      setErrorMessage(undefined);
    }

    if (formikRef !== undefined) {
      formikRef.current?.setSubmitting(true);
      formikRef.current?.submitForm();
    }
  };

  const handleCancel = () => {
    props.onClose();
  };

  return (
    <MapSideBarLayout
      title="Create Lease/License"
      icon={<Fence />}
      footer={
        <SidebarFooter
          isOkDisabled={formikRef.current?.isSubmitting || bcaLoading}
          onSave={handleSave}
          onCancel={handleCancel}
          errorMessage={errorMessage}
        />
      }
      showCloseButton
      onClose={handleCancel}
    >
      <AddLeaseForm
        onSubmit={(values: LeaseFormModel, formikHelpers: FormikHelpers<LeaseFormModel>) =>
          withUserOverride((useOverrideCodes: UserOverrideCode[]) =>
            saveLeaseFile(values, formikHelpers, useOverrideCodes),
          )
        }
        formikRef={formikRef}
        propertyInfo={initialProperty}
      />
    </MapSideBarLayout>
  );
};

export default AddLeaseContainer;
