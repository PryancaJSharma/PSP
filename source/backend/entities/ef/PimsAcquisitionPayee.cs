﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Pims.Dal.Entities
{
    [Table("PIMS_ACQUISITION_PAYEE")]
    [Index(nameof(AcquisitionFilePersonId), Name = "ACQPAY_ACQUISITION_FILE_PERSON_ID_IDX")]
    [Index(nameof(AcquisitionOwnerId), Name = "ACQPAY_ACQUISITION_OWNER_ID_IDX")]
    [Index(nameof(CompensationRequisitionId), Name = "ACQPAY_COMPENSATION_REQUISITION_ID_IDX")]
    [Index(nameof(InterestHolderId), Name = "ACQPAY_INTEREST_HOLDER_ID_IDX")]
    [Index(nameof(OwnerRepresentativeId), Name = "ACQPAY_OWNER_REPRESENTATIVE_ID_IDX")]
    [Index(nameof(OwnerSolicitorId), Name = "ACQPAY_OWNER_SOLICITOR_ID_IDX")]
    public partial class PimsAcquisitionPayee
    {
        [Key]
        [Column("ACQUISITION_PAYEE_ID")]
        public long AcquisitionPayeeId { get; set; }
        [Column("COMPENSATION_REQUISITION_ID")]
        public long CompensationRequisitionId { get; set; }
        [Column("ACQUISITION_OWNER_ID")]
        public long? AcquisitionOwnerId { get; set; }
        [Column("INTEREST_HOLDER_ID")]
        public long? InterestHolderId { get; set; }
        [Column("OWNER_REPRESENTATIVE_ID")]
        public long? OwnerRepresentativeId { get; set; }
        [Column("OWNER_SOLICITOR_ID")]
        public long? OwnerSolicitorId { get; set; }
        [Column("ACQUISITION_FILE_PERSON_ID")]
        public long? AcquisitionFilePersonId { get; set; }
        [Column("GST_NUMBER")]
        [StringLength(50)]
        public string GstNumber { get; set; }
        [Column("IS_PAYMENT_IN_TRUST")]
        public bool? IsPaymentInTrust { get; set; }
        [Column("IS_DISABLED")]
        public bool? IsDisabled { get; set; }
        [Column("CONCURRENCY_CONTROL_NUMBER")]
        public long ConcurrencyControlNumber { get; set; }
        [Column("APP_CREATE_TIMESTAMP", TypeName = "datetime")]
        public DateTime AppCreateTimestamp { get; set; }
        [Required]
        [Column("APP_CREATE_USERID")]
        [StringLength(30)]
        public string AppCreateUserid { get; set; }
        [Column("APP_CREATE_USER_GUID")]
        public Guid? AppCreateUserGuid { get; set; }
        [Required]
        [Column("APP_CREATE_USER_DIRECTORY")]
        [StringLength(30)]
        public string AppCreateUserDirectory { get; set; }
        [Column("APP_LAST_UPDATE_TIMESTAMP", TypeName = "datetime")]
        public DateTime AppLastUpdateTimestamp { get; set; }
        [Required]
        [Column("APP_LAST_UPDATE_USERID")]
        [StringLength(30)]
        public string AppLastUpdateUserid { get; set; }
        [Column("APP_LAST_UPDATE_USER_GUID")]
        public Guid? AppLastUpdateUserGuid { get; set; }
        [Required]
        [Column("APP_LAST_UPDATE_USER_DIRECTORY")]
        [StringLength(30)]
        public string AppLastUpdateUserDirectory { get; set; }
        [Column("DB_CREATE_TIMESTAMP", TypeName = "datetime")]
        public DateTime DbCreateTimestamp { get; set; }
        [Required]
        [Column("DB_CREATE_USERID")]
        [StringLength(30)]
        public string DbCreateUserid { get; set; }
        [Column("DB_LAST_UPDATE_TIMESTAMP", TypeName = "datetime")]
        public DateTime DbLastUpdateTimestamp { get; set; }
        [Required]
        [Column("DB_LAST_UPDATE_USERID")]
        [StringLength(30)]
        public string DbLastUpdateUserid { get; set; }

        [ForeignKey(nameof(AcquisitionFilePersonId))]
        [InverseProperty(nameof(PimsAcquisitionFilePerson.PimsAcquisitionPayees))]
        public virtual PimsAcquisitionFilePerson AcquisitionFilePerson { get; set; }
        [ForeignKey(nameof(AcquisitionOwnerId))]
        [InverseProperty(nameof(PimsAcquisitionOwner.PimsAcquisitionPayees))]
        public virtual PimsAcquisitionOwner AcquisitionOwner { get; set; }
        [ForeignKey(nameof(CompensationRequisitionId))]
        [InverseProperty(nameof(PimsCompensationRequisition.PimsAcquisitionPayees))]
        public virtual PimsCompensationRequisition CompensationRequisition { get; set; }
        [ForeignKey(nameof(InterestHolderId))]
        [InverseProperty(nameof(PimsInterestHolder.PimsAcquisitionPayees))]
        public virtual PimsInterestHolder InterestHolder { get; set; }
        [ForeignKey(nameof(OwnerRepresentativeId))]
        [InverseProperty(nameof(PimsAcquisitionOwnerRep.PimsAcquisitionPayees))]
        public virtual PimsAcquisitionOwnerRep OwnerRepresentative { get; set; }
        [ForeignKey(nameof(OwnerSolicitorId))]
        [InverseProperty(nameof(PimsAcquisitionOwnerSolicitor.PimsAcquisitionPayees))]
        public virtual PimsAcquisitionOwnerSolicitor OwnerSolicitor { get; set; }
    }
}
