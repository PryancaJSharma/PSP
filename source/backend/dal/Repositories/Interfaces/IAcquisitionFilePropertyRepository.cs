using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Repositories
{
    public interface IAcquisitionFilePropertyRepository : IRepository
    {
        List<PimsPropertyAcquisitionFile> GetPropertiesByAcquisitionFileId(long acquisitionFileId);

        List<PimsAcquisitionOwner> GetOwnersByAcquisitionFileId(long acquisitionFileId);

        List<PimsAcquisitionOwnerRep> GetOwnerRepresentatives(long acquisitionFileId);

        List<PimsAcquisitionOwnerSolicitor> GetOwnerSolicitors(long acquisitionFileId);

        int GetAcquisitionFilePropertyRelatedCount(long propertyId);

        PimsPropertyAcquisitionFile Add(PimsPropertyAcquisitionFile propertyAcquisitionFile);

        PimsPropertyAcquisitionFile Update(PimsPropertyAcquisitionFile propertyAcquisitionFile);

        void Delete(PimsPropertyAcquisitionFile propertyAcquisitionFile);

        List<PimsCompensationRequisition> GetCompensationRequisitionsByAcquisitionFileId(long acquisitionFileId);
    }
}
