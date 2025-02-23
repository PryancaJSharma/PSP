import { ReactComponent as RealEstateAgent } from 'assets/images/real-estate-agent.svg';
import { useMapSearch } from 'components/maps/hooks/useMapSearch';
import { MapStateContext } from 'components/maps/providers/MapStateContext';
import MapSideBarLayout from 'features/mapSideBar/layout/MapSideBarLayout';
import { FormikProps } from 'formik';
import { Api_AcquisitionFile } from 'models/api/AcquisitionFile';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { mapFeatureToProperty } from 'utils/mapPropertyUtils';

import { PropertyForm } from '../../shared/models';
import SidebarFooter from '../../shared/SidebarFooter';
import { useAddAcquisitionFormManagement } from '../hooks/useAddAcquisitionFormManagement';
import { AddAcquisitionForm } from './AddAcquisitionForm';
import { AcquisitionForm } from './models';

export interface IAddAcquisitionContainerProps {
  onClose?: () => void;
}

export const AddAcquisitionContainer: React.FC<IAddAcquisitionContainerProps> = props => {
  const { onClose } = props;
  const history = useHistory();
  const formikRef = useRef<FormikProps<AcquisitionForm>>(null);

  const close = useCallback(() => onClose && onClose(), [onClose]);
  const { selectedFileFeature } = React.useContext(MapStateContext);
  const { search } = useMapSearch();

  const initialForm = useMemo(() => {
    const acquisitionForm = new AcquisitionForm();
    if (!!selectedFileFeature) {
      const property = PropertyForm.fromMapProperty(mapFeatureToProperty(selectedFileFeature));
      acquisitionForm.properties = [property];
      acquisitionForm.region =
        property.regionName !== 'Cannot determine' ? property.region?.toString() : undefined;
    }
    return acquisitionForm;
  }, [selectedFileFeature]);

  useEffect(() => {
    if (!!selectedFileFeature && !!formikRef.current) {
      formikRef.current.resetForm();
      formikRef.current?.setFieldValue('properties', [
        PropertyForm.fromMapProperty(mapFeatureToProperty(selectedFileFeature)),
      ]);
    }
  }, [initialForm, selectedFileFeature]);

  const handleSave = () => {
    formikRef.current?.setSubmitting(true);
    formikRef.current?.submitForm();
  };

  // navigate to read-only view after file has been created
  const onSuccess = async (acqFile: Api_AcquisitionFile) => {
    if (acqFile.fileProperties?.find(ap => !ap.property?.address && !ap.property?.id)) {
      toast.warn(
        'Address could not be retrieved for this property, it will have to be provided manually in property details tab',
        { autoClose: 15000 },
      );
    }
    await search();
    history.replace(`/mapview/sidebar/acquisition/${acqFile.id}`);
    formikRef.current?.resetForm({ values: AcquisitionForm.fromApi(acqFile) });
  };

  const helper = useAddAcquisitionFormManagement({
    onSuccess,
    initialForm,
    selectedFeature: selectedFileFeature,
    formikRef,
  });

  return (
    <MapSideBarLayout
      showCloseButton
      title="Create Acquisition File"
      icon={
        <RealEstateAgent
          title="Acquisition file Icon"
          width="2.6rem"
          height="2.6rem"
          fill="currentColor"
          className="mr-2"
        />
      }
      onClose={close}
      footer={<SidebarFooter isOkDisabled={helper.loading} onSave={handleSave} onCancel={close} />}
    >
      <StyledFormWrapper>
        <AddAcquisitionForm
          ref={formikRef}
          initialValues={helper.initialValues}
          onSubmit={helper.handleSubmit}
          validationSchema={helper.validationSchema}
        />
      </StyledFormWrapper>
    </MapSideBarLayout>
  );
};

export default AddAcquisitionContainer;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
  height: 100%;
  overflow-y: auto;
  padding-right: 1rem;
  padding-bottom: 1rem;
`;
