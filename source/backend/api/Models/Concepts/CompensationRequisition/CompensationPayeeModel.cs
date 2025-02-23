namespace Pims.Api.Models.Concepts
{
    public class CompensationPayeeModel : BaseAppModel
    {
        public long? Id { get; set; }

        public long CompensationRequisitionId { get; set; }

        public bool? IsPaymentInTrust { get; set; }

        public string GstNumber { get; set; }

        public long? AcquisitionOwnerId { get; set; }

        public long? InterestHolderId { get; set; }

        public long? OwnerRepresentativeId { get; set; }

        public long? OwnerSolicitorId { get; set; }

        public long? MotiSolicitorId { get; set; }

        public bool? IsDisabled { get; set; }

        public PersonModel MotiSolicitor { get; set; }

        public AcquisitionFileOwnerModel AcquisitionOwner { get; set; }

        public CompensationRequisitionModel CompensationRequisition { get; set; }

        public InterestHolderModel InterestHolder { get; set; }

        public AcquisitionFileOwnerRepresentativeModel OwnerRepresentative { get; set; }

        public AcquisitionFileOwnerSolicitorModel OwnerSolicitor { get; set; }
    }
}
