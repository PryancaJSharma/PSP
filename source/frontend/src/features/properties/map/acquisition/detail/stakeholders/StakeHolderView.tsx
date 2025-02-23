import EditButton from 'components/common/EditButton';
import LoadingBackdrop from 'components/common/LoadingBackdrop';
import { Section } from 'components/common/Section/Section';
import { StyledEditWrapper, StyledSummarySection } from 'components/common/Section/SectionStyles';
import { Claims } from 'constants/index';
import { StyledNoData } from 'features/documents/commonStyles';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import * as React from 'react';

import { InterestHolderViewForm } from '../../update/stakeholders/models';
import PropertyInterestHoldersViewTable from './PropertyInterestHoldersViewTable';

export interface IStakeHolderViewProps {
  loading: boolean;
  groupedInterestProperties: InterestHolderViewForm[];
  groupedNonInterestProperties: InterestHolderViewForm[];
  onEdit: () => void;
}

export const StakeHolderView: React.FunctionComponent<IStakeHolderViewProps> = ({
  loading,
  groupedInterestProperties,
  groupedNonInterestProperties,
  onEdit,
}) => {
  const keycloak = useKeycloakWrapper();
  return (
    <>
      <StyledSummarySection>
        <LoadingBackdrop show={loading} parentScreen={true} />

        <Section isCollapsable initiallyExpanded header="Interests">
          <StyledEditWrapper className="mr-3 my-1">
            {keycloak.hasClaim(Claims.ACQUISITION_EDIT) ? (
              <EditButton title="Edit Interests" onClick={onEdit} />
            ) : null}
          </StyledEditWrapper>
          {groupedInterestProperties.length === 0 && (
            <StyledNoData>
              <p>There are no interest holders associated with this file.</p>
              <p> To add an interest holder, click the edit button.</p>
            </StyledNoData>
          )}
          {groupedInterestProperties.map((interestPropertyGroup, index) => (
            <PropertyInterestHoldersViewTable
              key={`interest-holder-section-${index}`}
              propertyInterestHolders={interestPropertyGroup}
            />
          ))}
        </Section>
      </StyledSummarySection>
      <StyledSummarySection>
        <Section isCollapsable initiallyExpanded header="Non-interest Payees">
          <StyledEditWrapper className="mr-3 my-1">
            {keycloak.hasClaim(Claims.ACQUISITION_EDIT) ? (
              <EditButton title="Edit Non-interest payees" onClick={onEdit} />
            ) : null}
          </StyledEditWrapper>
          {groupedNonInterestProperties.length === 0 && (
            <StyledNoData>
              <p>There are no non-interest payees associated with this file.</p>
              <p> To add a non-interest payee, click the edit button.</p>
            </StyledNoData>
          )}
          {groupedNonInterestProperties.map((interestPropertyGroup, index) => (
            <PropertyInterestHoldersViewTable
              key={`non-interest-payee-section-${index}`}
              propertyInterestHolders={interestPropertyGroup}
            />
          ))}
        </Section>
      </StyledSummarySection>
    </>
  );
};

export default StakeHolderView;
