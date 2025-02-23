using System;
using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Api.Services
{
    public interface ILeasePaymentService
    {
        PimsLease AddPayment(long leaseId, long leaseRowVersion, PimsLeasePayment payment);

        PimsLease UpdatePayment(long leaseId, long paymentId, long leaseRowVersion, PimsLeasePayment payment);

        PimsLease DeletePayment(long leaseId, long leaseRowVersion, PimsLeasePayment payment);

        IEnumerable<PimsLeasePayment> GetAllByDateRange(DateTime startDate, DateTime endDate);
    }
}
