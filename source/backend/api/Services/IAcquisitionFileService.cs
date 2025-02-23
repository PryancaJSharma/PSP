using System.Collections.Generic;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Exceptions;

namespace Pims.Api.Services
{
    public interface IAcquisitionFileService
    {
        Paged<PimsAcquisitionFile> GetPage(AcquisitionFilter filter);

        PimsAcquisitionFile GetById(long id);

        PimsAcquisitionFile Add(PimsAcquisitionFile acquisitionFile, IEnumerable<UserOverrideCode> userOverrides);

        PimsAcquisitionFile Update(PimsAcquisitionFile acquisitionFile, IEnumerable<UserOverrideCode> userOverrides);

        PimsAcquisitionFile UpdateProperties(PimsAcquisitionFile acquisitionFile, IEnumerable<UserOverrideCode> userOverrides);

        IEnumerable<PimsPropertyAcquisitionFile> GetProperties(long id);

        IEnumerable<PimsAcquisitionOwner> GetOwners(long id);

        IEnumerable<PimsAcquisitionOwnerRep> GetOwnerRepresentatives(long id);

        IEnumerable<PimsAcquisitionOwnerSolicitor> GetOwnerSolicitors(long id);

        IEnumerable<PimsAcquisitionChecklistItem> GetChecklistItems(long id);

        PimsAcquisitionFile UpdateChecklistItems(PimsAcquisitionFile acquisitionFile);

        IEnumerable<PimsAgreement> GetAgreements(long id);

        IEnumerable<PimsAgreement> UpdateAgreements(long acquisitionFileId, List<PimsAgreement> agreements);

        IEnumerable<PimsInterestHolder> GetInterestHolders(long id);

        IEnumerable<PimsInterestHolder> UpdateInterestHolders(long acquisitionFileId, List<PimsInterestHolder> interestHolders);

        IList<PimsCompensationRequisition> GetAcquisitionCompensations(long acquisitionFileId);

        PimsCompensationRequisition AddCompensationRequisition(long acquisitionFileId, PimsCompensationRequisition compensationRequisition);
    }
}
