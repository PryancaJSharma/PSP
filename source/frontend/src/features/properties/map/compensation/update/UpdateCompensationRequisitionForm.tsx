import {
  Check,
  FastCurrencyInput,
  FastDatePicker,
  Input,
  Select,
  SelectOption,
  TextArea,
} from 'components/common/form';
import { UnsavedChangesPrompt } from 'components/common/form/UnsavedChangesPrompt';
import LoadingBackdrop from 'components/common/LoadingBackdrop';
import { Section } from 'components/common/Section/Section';
import { SectionField } from 'components/common/Section/SectionField';
import { Formik, FormikProps } from 'formik';
import { getCancelModalProps, useModalContext } from 'hooks/useModalContext';
import { Api_AcquisitionFile } from 'models/api/AcquisitionFile';
import { Api_CompensationRequisition } from 'models/api/CompensationRequisition';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';
import styled from 'styled-components';
import { withNameSpace } from 'utils/formUtils';

import SidebarFooter from '../../shared/SidebarFooter';
import { CompensationRequisitionYupSchema } from '../CompensationRequisitionYupSchema';
import { CompensationRequisitionFormModel, PayeeOption } from '../models';
import FinancialActivitiesSubForm from './financials/FinancialActivitiesSubForm';

export interface CompensationRequisitionFormProps {
  isLoading: boolean;
  acquisitionFile: Api_AcquisitionFile;
  payeeOptions: PayeeOption[];
  initialValues: CompensationRequisitionFormModel;
  gstConstant: number;
  financialActivityOptions: SelectOption[];
  chartOfAccountsOptions: SelectOption[];
  responsiblityCentreOptions: SelectOption[];
  yearlyFinancialOptions: SelectOption[];
  onSave: (
    compensation: CompensationRequisitionFormModel,
  ) => Promise<Api_CompensationRequisition | undefined>;
  onCancel: () => void;
}

const UpdateCompensationRequisitionForm: React.FC<CompensationRequisitionFormProps> = ({
  isLoading,
  acquisitionFile,
  payeeOptions,
  initialValues,
  gstConstant,
  financialActivityOptions,
  chartOfAccountsOptions,
  responsiblityCentreOptions,
  yearlyFinancialOptions,
  onSave,
  onCancel,
}) => {
  const fiscalYearOptions = generateFiscalYearOptions();
  const { setModalContent, setDisplayModal } = useModalContext();
  const formikRef = useRef<FormikProps<CompensationRequisitionFormModel>>(null);
  const [activitiesUpdated, setActivitiesUpdated] = useState<boolean>(false);

  const cancelFunc = (resetForm: () => void, dirty: boolean) => {
    if (!dirty) {
      resetForm();
      onCancel();
    } else {
      setModalContent({
        ...getCancelModalProps(),
        handleOk: () => {
          resetForm();
          setDisplayModal(false);
          onCancel();
        },
      });
      setDisplayModal(true);
    }
  };

  const onFinancialActivitiesUpdated = (values: CompensationRequisitionFormModel) => {
    const pretaxAmount = values?.financials
      .map(f => f.pretaxAmount)
      .reduce((prev, next) => prev + next, 0);

    const taxAmount = values?.financials
      .map(f => f.taxAmount)
      .reduce((prev, next) => prev + next, 0);

    const totalAmount = values?.financials
      .map(f => f.totalAmount)
      .reduce((prev, next) => prev + next, 0);

    formikRef.current?.setFieldValue(`payees.0.pretaxAmount`, pretaxAmount);
    formikRef.current?.setFieldValue(`payees.0.taxAmount`, taxAmount);
    formikRef.current?.setFieldValue(`payees.0.totalAmount`, totalAmount);
  };

  useEffect(() => {
    if (activitiesUpdated && formikRef.current?.values) {
      onFinancialActivitiesUpdated(formikRef.current?.values);
      setActivitiesUpdated(false);
    }
  }, [activitiesUpdated]);

  return (
    <StyledFormWrapper>
      <Formik<CompensationRequisitionFormModel>
        enableReinitialize
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={async values => {
          await onSave(values);
        }}
        validationSchema={CompensationRequisitionYupSchema}
        validateOnChange={true}
      >
        {formikProps => {
          return (
            <>
              <LoadingBackdrop show={isLoading}></LoadingBackdrop>
              <UnsavedChangesPrompt />

              <StyledContent>
                <Section header="Requisition details">
                  <SectionField label="Status" labelWidth="5">
                    <Select
                      field="status"
                      options={[
                        {
                          label: 'Draft',
                          value: 'draft',
                        },
                        {
                          label: 'Final',
                          value: 'final',
                        },
                      ]}
                      placeholder="Select..."
                    />
                  </SectionField>
                  <SectionField label="Agreement date" labelWidth="5" contentWidth="4">
                    <FastDatePicker field="agreementDateTime" formikProps={formikProps} />
                  </SectionField>
                  <SectionField
                    label="Expropriation notice served date"
                    labelWidth="5"
                    contentWidth="4"
                  >
                    <FastDatePicker
                      field="expropriationNoticeServedDateTime"
                      formikProps={formikProps}
                    />
                  </SectionField>
                  <SectionField label="Expropriation vesting date" labelWidth="5" contentWidth="4">
                    <FastDatePicker
                      field="expropriationVestingDateTime"
                      formikProps={formikProps}
                    />
                  </SectionField>
                  <SectionField label="Special instructions" labelWidth="12">
                    <MediumTextArea field="specialInstruction" />
                  </SectionField>
                </Section>

                <Section header="Financial coding">
                  <SectionField label="Product" labelWidth="4">
                    {acquisitionFile.product?.code ?? ''}
                  </SectionField>
                  <SectionField label="Business function" labelWidth="4">
                    {acquisitionFile.project?.businessFunctionCode?.code ?? ''}
                  </SectionField>
                  <SectionField label="Work activity" labelWidth="4">
                    {acquisitionFile.project?.workActivityCode?.code ?? ''}
                  </SectionField>
                  <SectionField label="Cost type" labelWidth="4">
                    {acquisitionFile.project?.costTypeCode?.code ?? ''}
                  </SectionField>
                  <SectionField label="Fiscal year" labelWidth="4" contentWidth="4" required>
                    <Select
                      field="fiscalYear"
                      options={fiscalYearOptions}
                      placeholder="Select..."
                    />
                  </SectionField>
                  <SectionField label="STOB" labelWidth="4" contentWidth="4" required>
                    <Select field="stob" options={yearlyFinancialOptions} placeholder="Select..." />
                  </SectionField>
                  <SectionField label="Service line" labelWidth="4" required>
                    <Select
                      field="serviceLine"
                      options={chartOfAccountsOptions}
                      placeholder="Select..."
                    />
                  </SectionField>
                  <SectionField label="Responsibility centre" labelWidth="4" required>
                    <Select
                      field="responsibilityCentre"
                      options={responsiblityCentreOptions}
                      placeholder="Select..."
                    />
                  </SectionField>
                </Section>

                <Section header="Payment" isCollapsable initiallyExpanded>
                  <SectionField label="Payee" labelWidth="4" required>
                    <Select
                      field="payeeKey"
                      options={payeeOptions.map<SelectOption>(x => {
                        return { label: x.text, value: x.value };
                      })}
                      placeholder="Select..."
                    />
                  </SectionField>
                  <SectionField label="Payment in Trust?">
                    <Check field={withNameSpace('payees.0', 'isPaymentInTrust')} />
                  </SectionField>
                  <SectionField label="GST number" tooltip="Include GST # if applicable">
                    <Input field={withNameSpace('payees.0', 'gstNumber')}></Input>
                  </SectionField>
                  <SectionField label="Amount (before tax)">
                    <FastCurrencyInput
                      field={withNameSpace('payees.0', 'pretaxAmount')}
                      formikProps={formikProps}
                      disabled
                    />
                  </SectionField>
                  <SectionField label="GST amount">
                    <FastCurrencyInput
                      field={withNameSpace('payees.0', 'taxAmount')}
                      formikProps={formikProps}
                      disabled
                    />
                  </SectionField>
                  <SectionField
                    label="Total amount"
                    tooltip="Calculated total of all activities in this compensation requisition"
                  >
                    <FastCurrencyInput
                      field={withNameSpace('payees.0', 'totalAmount')}
                      formikProps={formikProps}
                      disabled
                    />
                  </SectionField>
                </Section>

                <Section header="Activities" isCollapsable initiallyExpanded>
                  <FinancialActivitiesSubForm
                    financialActivityOptions={financialActivityOptions}
                    compensationRequisitionId={initialValues.id!}
                    formikProps={formikProps}
                    gstConstant={gstConstant}
                    activitiesUpdated={() => {
                      setActivitiesUpdated(true);
                    }}
                  ></FinancialActivitiesSubForm>
                </Section>

                <Section>
                  <SectionField label="Detailed remarks" labelWidth="12">
                    <MediumTextArea field="detailedRemarks" />
                  </SectionField>
                </Section>
              </StyledContent>

              <Prompt
                when={formikProps.dirty}
                message="You have made changes on this form. Do you wish to leave without saving?"
              />

              <StyledFooter>
                <SidebarFooter
                  onSave={() => formikProps.submitForm()}
                  isOkDisabled={formikProps.isSubmitting || !formikProps.dirty}
                  onCancel={() => cancelFunc(formikProps.resetForm, formikProps.dirty)}
                />
              </StyledFooter>
            </>
          );
        }}
      </Formik>
    </StyledFormWrapper>
  );
};

export default UpdateCompensationRequisitionForm;

const generateFiscalYearOptions = () => {
  let sysdate = moment();
  let pivotYear = sysdate.month() >= 4 ? moment().year() : moment().subtract(1, 'years').year();

  const options: SelectOption[] = [];

  options.push({ label: `${pivotYear - 1}/${pivotYear}`, value: `${pivotYear - 1}/${pivotYear}` });
  options.push({ label: `${pivotYear}/${pivotYear + 1}`, value: `${pivotYear}/${pivotYear + 1}` });
  options.push({
    label: `${pivotYear + 1}/${pivotYear + 2}`,
    value: `${pivotYear + 1}/${pivotYear + 2}`,
  });

  return options;
};

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

const StyledContent = styled.div`
  background-color: ${props => props.theme.css.filterBackgroundColor};
`;

const StyledFooter = styled.div`
  margin-right: 1rem;
  padding-bottom: 1rem;
`;

const MediumTextArea = styled(TextArea)`
  textarea.form-control {
    min-width: 100%;
    height: 7rem;
    resize: none;
  }
`;
