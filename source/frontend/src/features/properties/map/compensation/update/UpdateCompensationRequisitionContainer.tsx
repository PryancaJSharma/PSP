import { SelectOption } from 'components/common/form';
import { useAcquisitionProvider } from 'hooks/repositories/useAcquisitionProvider';
import { useFinancialCodeRepository } from 'hooks/repositories/useFinancialCodeRepository';
import { useInterestHolderRepository } from 'hooks/repositories/useInterestHolderRepository';
import { useCompensationRequisitionRepository } from 'hooks/repositories/useRequisitionCompensationRepository';
import { Api_AcquisitionFile, Api_AcquisitionFilePerson } from 'models/api/AcquisitionFile';
import { Api_CompensationRequisition } from 'models/api/CompensationRequisition';
import { useCallback, useEffect, useState } from 'react';
import { SystemConstants, useSystemConstants } from 'store/slices/systemConstants';

import { CompensationRequisitionFormModel, PayeeOption } from '../models';
import { CompensationRequisitionFormProps } from './UpdateCompensationRequisitionForm';

export interface UpdateCompensationRequisitionContainerProps {
  compensation: Api_CompensationRequisition;
  acquisitionFile: Api_AcquisitionFile;
  onSuccess: () => void;
  onCancel: () => void;
  View: React.FC<CompensationRequisitionFormProps>;
}

const UpdateCompensationRequisitionContainer: React.FC<
  UpdateCompensationRequisitionContainerProps
> = ({ compensation, acquisitionFile, onSuccess, onCancel, View }) => {
  const [payeeOptions, setPayeeOptions] = useState<PayeeOption[]>([]);
  const [financialActivityOptions, setFinancialActivityOptions] = useState<SelectOption[]>([]);
  const [chartOfAccountOptions, setChartOfAccountOptions] = useState<SelectOption[]>([]);
  const [responsibilityCentreOptions, setResponsibilityCentreOptions] = useState<SelectOption[]>(
    [],
  );
  const [yearlyFinancialOptions, setyearlyFinancialOptions] = useState<SelectOption[]>([]);
  const { getSystemConstant } = useSystemConstants();
  const gstConstant = getSystemConstant(SystemConstants.GST);
  const gstDecimalPercentage =
    gstConstant !== undefined ? parseFloat(gstConstant.value) / 100 : undefined;
  const {
    updateCompensationRequisition: { execute: updateCompensationRequisition, loading: isUpdating },
  } = useCompensationRequisitionRepository();

  const {
    getAcquisitionOwners: { execute: retrieveAcquisitionOwners, loading: loadingAcquisitionOwners },
    getAcquisitionFileSolicitors: {
      execute: retrieveAcquisitionFileSolicitors,
      loading: loadingAcquisitionFileSolicitors,
    },
    getAcquisitionFileRepresentatives: {
      execute: retrieveAcquisitionFileRepresentatives,
      loading: loadingAcquisitionFileRepresentatives,
    },
  } = useAcquisitionProvider();

  const {
    getAcquisitionInterestHolders: {
      execute: fetchInterestHolders,
      loading: loadingInterestHolders,
    },
  } = useInterestHolderRepository();

  const {
    getFinancialActivityCodeTypes: {
      execute: fetchFinancialActivities,
      loading: loadingFinancialActivities,
    },
    getChartOfAccountsCodeTypes: { execute: fetchChartOfAccounts, loading: loadingChartOfAccounts },
    getResponsibilityCodeTypes: {
      execute: fetchResponsibilityCodes,
      loading: loadingResponsibilityCodes,
    },
    getYearlyFinancialsCodeTypes: {
      execute: fetchYearlyFinancials,
      loading: loadingYearlyFinancials,
    },
  } = useFinancialCodeRepository();

  const updateCompensation = async (compensation: CompensationRequisitionFormModel) => {
    const compensationApiModel = compensation.toApi(payeeOptions);

    const result = await updateCompensationRequisition(compensationApiModel);
    if (result !== undefined) {
      onSuccess();
    }
    return result;
  };

  const fetchContacts = useCallback(async () => {
    if (acquisitionFile.id) {
      const acquisitionOwnersCall = retrieveAcquisitionOwners(acquisitionFile.id);
      const acquisitionSolicitorsCall = retrieveAcquisitionFileSolicitors(acquisitionFile.id);
      const acquisitionRepresentativesCall = retrieveAcquisitionFileRepresentatives(
        acquisitionFile.id,
      );
      const interestHoldersCall = fetchInterestHolders(acquisitionFile.id);

      await Promise.all([
        acquisitionOwnersCall,
        acquisitionSolicitorsCall,
        acquisitionRepresentativesCall,
        interestHoldersCall,
      ]).then(
        ([
          acquisitionOwners,
          acquisitionSolicitors,
          acquisitionRepresentatives,
          interestHolders,
        ]) => {
          const options = payeeOptions;

          if (acquisitionOwners !== undefined) {
            const ownersOptions: PayeeOption[] = acquisitionOwners.map(x =>
              PayeeOption.createOwner(x),
            );
            options.push(...ownersOptions);
          }

          if (acquisitionSolicitors !== undefined) {
            const acquisitionSolicitorOptions: PayeeOption[] = acquisitionSolicitors.map(x =>
              PayeeOption.createOwnerSolicitor(x),
            );
            options.push(...acquisitionSolicitorOptions);
          }

          if (acquisitionRepresentatives !== undefined) {
            const acquisitionSolicitorOptions: PayeeOption[] = acquisitionRepresentatives.map(x =>
              PayeeOption.createOwnerRepresentative(x),
            );
            options.push(...acquisitionSolicitorOptions);
          }

          if (interestHolders !== undefined) {
            const interestHolderOptions: PayeeOption[] = interestHolders.map(x =>
              PayeeOption.createInterestHolder(x),
            );
            options.push(...interestHolderOptions);
          }

          const teamMemberOptions: PayeeOption[] =
            acquisitionFile.acquisitionTeam
              ?.filter((x): x is Api_AcquisitionFilePerson => !!x)
              .filter(x => x.personProfileTypeCode === 'MOTILAWYER')
              .map(x => PayeeOption.createTeamMember(x)) || [];
          options.push(...teamMemberOptions);

          setPayeeOptions(options);
        },
      );
    }
  }, [
    payeeOptions,
    acquisitionFile.acquisitionTeam,
    acquisitionFile.id,
    retrieveAcquisitionOwners,
    retrieveAcquisitionFileSolicitors,
    retrieveAcquisitionFileRepresentatives,
    fetchInterestHolders,
  ]);

  const fetchFinancialCodes = useCallback(async () => {
    const fetchFinancialActivitiesCall = fetchFinancialActivities();
    const fetchChartOfAccountsCall = fetchChartOfAccounts();
    const fetchResponsibilityCodesCall = fetchResponsibilityCodes();
    const fetchYearlyFinancialsCall = fetchYearlyFinancials();

    await Promise.all([
      fetchFinancialActivitiesCall,
      fetchChartOfAccountsCall,
      fetchResponsibilityCodesCall,
      fetchYearlyFinancialsCall,
    ]).then(([activities, charts, responsibilities, yearly]) => {
      const activityOptions: SelectOption[] =
        activities?.map(item => {
          return {
            label: `${item.code} - ${item.description}`,
            value: item.id!,
          };
        }) ?? [];

      const chartsOptions: SelectOption[] =
        charts?.map(item => {
          return {
            label: `${item.code} - ${item.description}`,
            value: item.id!,
          };
        }) ?? [];

      const responsibilitiesOptions: SelectOption[] =
        responsibilities?.map(item => {
          return {
            label: `${item.code} - ${item.description}`,
            value: item.id!,
          };
        }) ?? [];

      const yearlyOptions: SelectOption[] =
        yearly?.map(item => {
          return {
            label: `${item.code}`,
            value: item.id!,
          };
        }) ?? [];

      setFinancialActivityOptions(activityOptions);
      setChartOfAccountOptions(chartsOptions);
      setResponsibilityCentreOptions(responsibilitiesOptions);
      setyearlyFinancialOptions(yearlyOptions);
    });
  }, [
    fetchChartOfAccounts,
    fetchFinancialActivities,
    fetchResponsibilityCodes,
    fetchYearlyFinancials,
  ]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  useEffect(() => {
    fetchFinancialCodes();
  }, [fetchFinancialCodes]);

  return (
    <View
      isLoading={
        isUpdating ||
        loadingAcquisitionOwners ||
        loadingAcquisitionFileSolicitors ||
        loadingAcquisitionFileRepresentatives ||
        loadingFinancialActivities ||
        loadingChartOfAccounts ||
        loadingResponsibilityCodes ||
        loadingYearlyFinancials ||
        loadingInterestHolders
      }
      initialValues={CompensationRequisitionFormModel.fromApi(compensation)}
      payeeOptions={payeeOptions}
      gstConstant={gstDecimalPercentage ?? 0}
      financialActivityOptions={financialActivityOptions}
      chartOfAccountsOptions={chartOfAccountOptions}
      responsiblityCentreOptions={responsibilityCentreOptions}
      yearlyFinancialOptions={yearlyFinancialOptions}
      acquisitionFile={acquisitionFile}
      onSave={updateCompensation}
      onCancel={onCancel}
    />
  );
};

export default UpdateCompensationRequisitionContainer;
