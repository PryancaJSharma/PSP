import { AxiosResponse } from 'axios';
import { useApiAcquisitionFile } from 'hooks/pims-api/useApiAcquisitionFile';
import { useApiRequestWrapper } from 'hooks/pims-api/useApiRequestWrapper';
import {
  Api_AcquisitionFile,
  Api_AcquisitionFileChecklistItem,
  Api_AcquisitionFileOwner,
  Api_AcquisitionFileProperty,
  Api_AcquisitionFileRepresentative,
  Api_AcquisitionFileSolicitor,
} from 'models/api/AcquisitionFile';
import { Api_CompensationFinancial } from 'models/api/CompensationFinancial';
import { Api_CompensationRequisition } from 'models/api/CompensationRequisition';
import { Api_Product, Api_Project } from 'models/api/Project';
import { UserOverrideCode } from 'models/api/UserOverrideCode';
import { useCallback, useMemo } from 'react';
import { useAxiosErrorHandler, useAxiosSuccessHandler } from 'utils';

const ignoreErrorCodes = [409];

/**
 * hook that interacts with the Acquisition File API.
 */
export const useAcquisitionProvider = () => {
  const {
    getAcquisitionFile,
    postAcquisitionFile,
    putAcquisitionFile,
    putAcquisitionFileProperties,
    getAcquisitionFileProperties,
    getAcquisitionFileOwners,
    getAcquisitionFileSolicitors,
    getAcquisitionFileRepresentatives,
    getAcquisitionFileProject,
    getAcquisitionFileProduct,
    getAcquisitionFileChecklist,
    putAcquisitionFileChecklist,
    getFileCompensationRequisitions,
    postFileCompensationRequisition,
    getFileCompReqH120s,
  } = useApiAcquisitionFile();

  const addAcquisitionFileApi = useApiRequestWrapper<
    (
      acqFile: Api_AcquisitionFile,
      userOverrideCodes: UserOverrideCode[],
    ) => Promise<AxiosResponse<Api_AcquisitionFile, any>>
  >({
    requestFunction: useCallback(
      async (acqFile: Api_AcquisitionFile, useOverride: UserOverrideCode[] = []) =>
        await postAcquisitionFile(acqFile, useOverride),
      [postAcquisitionFile],
    ),
    requestName: 'AddAcquisitionFile',
    onSuccess: useAxiosSuccessHandler('Acquisition File saved'),
    skipErrorLogCodes: ignoreErrorCodes,
    throwError: true,
  });

  const getAcquisitionFileApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFile, any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFile(acqFileId),
      [getAcquisitionFile],
    ),
    requestName: 'RetrieveAcquisitionFile',
    onError: useAxiosErrorHandler('Failed to load Acquisition File'),
  });

  const updateAcquisitionFileApi = useApiRequestWrapper<
    (
      acqFile: Api_AcquisitionFile,
      userOverrideCodes: UserOverrideCode[],
    ) => Promise<AxiosResponse<Api_AcquisitionFile, any>>
  >({
    requestFunction: useCallback(
      async (acqFile: Api_AcquisitionFile, userOverrideCodes: UserOverrideCode[] = []) =>
        await putAcquisitionFile(acqFile, userOverrideCodes),
      [putAcquisitionFile],
    ),
    requestName: 'UpdateAcquisitionFile',
    onSuccess: useAxiosSuccessHandler('Acquisition File updated'),
    skipErrorLogCodes: ignoreErrorCodes,
    throwError: true,
  });

  const updateAcquisitionPropertiesApi = useApiRequestWrapper<
    (
      acqFile: Api_AcquisitionFile,
      userOverrideCodes: UserOverrideCode[],
    ) => Promise<AxiosResponse<Api_AcquisitionFile, any>>
  >({
    requestFunction: useCallback(
      async (acqFile: Api_AcquisitionFile, userOverrideCodes: UserOverrideCode[]) =>
        await putAcquisitionFileProperties(acqFile, userOverrideCodes),
      [putAcquisitionFileProperties],
    ),
    requestName: 'UpdateAcquisitionFileProperties',
    onSuccess: useAxiosSuccessHandler('Acquisition File Properties updated'),
    skipErrorLogCodes: ignoreErrorCodes,
    throwError: true,
  });

  const getAcquisitionPropertiesApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFileProperty[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileProperties(acqFileId),
      [getAcquisitionFileProperties],
    ),
    requestName: 'GetAcquisitionFileProperties',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Properties'),
  });

  const getAcquisitionOwnersApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFileOwner[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileOwners(acqFileId),
      [getAcquisitionFileOwners],
    ),
    requestName: 'GetAcquisitionFileOwners',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Owners'),
  });

  const getAcquisitionFileSolicitorsApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFileSolicitor[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileSolicitors(acqFileId),
      [getAcquisitionFileSolicitors],
    ),
    requestName: 'getAcquisitionFileSolicitorsApi',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Owner solicitors'),
  });

  const getAcquisitionFileRepresentativesApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFileRepresentative[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileRepresentatives(acqFileId),
      [getAcquisitionFileRepresentatives],
    ),
    requestName: 'getAcquisitionFileRepresentativesApi',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Owner representatives'),
  });

  const getAcquisitionProjectApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_Project, any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileProject(acqFileId),
      [getAcquisitionFileProject],
    ),
    requestName: 'GetAcquisitionFileProject',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Project'),
  });

  const getAcquisitionProductApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_Product, any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileProduct(acqFileId),
      [getAcquisitionFileProduct],
    ),
    requestName: 'GetAcquisitionFileProduct',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Product'),
  });

  const getAcquisitionChecklistApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_AcquisitionFileChecklistItem[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getAcquisitionFileChecklist(acqFileId),
      [getAcquisitionFileChecklist],
    ),
    requestName: 'GetAcquisitionFileChecklist',
    onError: useAxiosErrorHandler('Failed to retrieve Acquisition File Checklist'),
  });

  const updateAcquisitionChecklistApi = useApiRequestWrapper<
    (acqFile: Api_AcquisitionFile) => Promise<AxiosResponse<Api_AcquisitionFile, any>>
  >({
    requestFunction: useCallback(
      async (acqFile: Api_AcquisitionFile) => await putAcquisitionFileChecklist(acqFile),
      [putAcquisitionFileChecklist],
    ),
    requestName: 'UpdateAcquisitionFileChecklist',
    onError: useAxiosErrorHandler('Failed to update Acquisition File Checklist'),
    throwError: true,
  });

  const getAcquisitionCompensationRequisitionsApi = useApiRequestWrapper<
    (acqFileId: number) => Promise<AxiosResponse<Api_CompensationRequisition[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number) => await getFileCompensationRequisitions(acqFileId),
      [getFileCompensationRequisitions],
    ),
    requestName: 'GetAcquisitionCompensationRequisitions',
    onError: useAxiosErrorHandler(
      'Failed to load requisition compensations. Refresh the page to try again.',
    ),
  });

  const getAcquisitionCompReqH120sApi = useApiRequestWrapper<
    (
      acqFileId: number,
      finalOnly: boolean,
    ) => Promise<AxiosResponse<Api_CompensationFinancial[], any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number, finalOnly: boolean) =>
        await getFileCompReqH120s(acqFileId, finalOnly),
      [getFileCompReqH120s],
    ),
    requestName: 'getAcquisitionCompReqH120s',
    onError: useAxiosErrorHandler(
      'Failed to load requisition compensation financials. Refresh the page to try again.',
    ),
  });

  const postFileCompensationRequisitionApi = useApiRequestWrapper<
    (
      acqFileId: number,
      compRequisition: Api_CompensationRequisition,
    ) => Promise<AxiosResponse<Api_CompensationRequisition, any>>
  >({
    requestFunction: useCallback(
      async (acqFileId: number, compRequisition: Api_CompensationRequisition) =>
        await postFileCompensationRequisition(acqFileId, compRequisition),
      [postFileCompensationRequisition],
    ),
    requestName: 'PostFileCompensationRequisition',
    onSuccess: useAxiosSuccessHandler('Compensation requisition saved'),
    onError: useAxiosErrorHandler('Failed to save Compensation requisition'),
  });

  return useMemo(
    () => ({
      addAcquisitionFile: addAcquisitionFileApi,
      getAcquisitionFile: getAcquisitionFileApi,
      updateAcquisitionFile: updateAcquisitionFileApi,
      updateAcquisitionProperties: updateAcquisitionPropertiesApi,
      getAcquisitionProperties: getAcquisitionPropertiesApi,
      getAcquisitionOwners: getAcquisitionOwnersApi,
      getAcquisitionFileSolicitors: getAcquisitionFileSolicitorsApi,
      getAcquisitionFileRepresentatives: getAcquisitionFileRepresentativesApi,
      getAcquisitionProject: getAcquisitionProjectApi,
      getAcquisitionProduct: getAcquisitionProductApi,
      getAcquisitionFileChecklist: getAcquisitionChecklistApi,
      updateAcquisitionChecklist: updateAcquisitionChecklistApi,
      getAcquisitionCompensationRequisitions: getAcquisitionCompensationRequisitionsApi,
      postAcquisitionCompensationRequisition: postFileCompensationRequisitionApi,
      getAcquisitionCompReqH120s: getAcquisitionCompReqH120sApi,
    }),
    [
      addAcquisitionFileApi,
      getAcquisitionFileApi,
      updateAcquisitionFileApi,
      updateAcquisitionPropertiesApi,
      getAcquisitionPropertiesApi,
      getAcquisitionOwnersApi,
      getAcquisitionFileSolicitorsApi,
      getAcquisitionFileRepresentativesApi,
      getAcquisitionProjectApi,
      getAcquisitionProductApi,
      getAcquisitionChecklistApi,
      updateAcquisitionChecklistApi,
      getAcquisitionCompensationRequisitionsApi,
      postFileCompensationRequisitionApi,
      getAcquisitionCompReqH120sApi,
    ],
  );
};
