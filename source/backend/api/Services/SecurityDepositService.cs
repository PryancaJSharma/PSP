using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Pims.Dal.Entities;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Repositories;
using Pims.Dal.Security;

namespace Pims.Api.Services
{
    public class SecurityDepositService : ISecurityDepositService
    {
        private readonly ISecurityDepositRepository _securityDepositRepository;
        private readonly ISecurityDepositReturnRepository _securityDepositReturnRepository;
        private readonly ILeaseRepository _leaseRepository;
        private readonly ILeaseService _leaseService;
        private readonly ClaimsPrincipal _user;

        public SecurityDepositService(ISecurityDepositRepository securityDepositRepository, ISecurityDepositReturnRepository securityDepositReturnRepository, ILeaseRepository leaseRepository, ILeaseService leaseService, ClaimsPrincipal user)
        {
            _securityDepositRepository = securityDepositRepository;
            _securityDepositReturnRepository = securityDepositReturnRepository;
            _leaseRepository = leaseRepository;
            _leaseService = leaseService;
            _user = user;
        }

        public PimsLease AddLeaseDeposit(long leaseId, long leaseRowVersion, PimsSecurityDeposit deposit)
        {
            _user.ThrowIfNotAuthorized(Permissions.LeaseAdd);
            ValidateServiceCall(leaseId, leaseRowVersion);
            _securityDepositRepository.Add(deposit);
            _securityDepositRepository.CommitTransaction();

            return _leaseRepository.Get(leaseId);
        }

        public PimsLease UpdateLeaseDeposit(long leaseId, long leaseRowVersion, PimsSecurityDeposit deposit)
        {
            _user.ThrowIfNotAuthorized(Permissions.LeaseEdit);
            ValidateServiceCall(leaseId, leaseRowVersion);
            var currentHolder = _securityDepositRepository.GetById(deposit.SecurityDepositId).PimsSecurityDepositHolder;
            if (currentHolder != null)
            {
                deposit.PimsSecurityDepositHolder.SecurityDepositHolderId = currentHolder.SecurityDepositHolderId;
                deposit.PimsSecurityDepositHolder.ConcurrencyControlNumber = currentHolder.ConcurrencyControlNumber;
            }
            _securityDepositRepository.Update(deposit);
            _securityDepositRepository.CommitTransaction();
            return _leaseRepository.Get(leaseId);
        }

        public PimsLease UpdateLeaseDepositNote(long leaseId, long leaseRowVersion, string note)
        {
            _user.ThrowIfNotAuthorized(Permissions.LeaseEdit);
            ValidateServiceCall(leaseId, leaseRowVersion);
            var lease = _leaseRepository.Get(leaseId);
            lease.ReturnNotes = note;
            _leaseRepository.Update(lease);
            _leaseRepository.CommitTransaction();

            return _leaseRepository.Get(leaseId);
        }

        public PimsLease DeleteLeaseDeposit(long leaseId, long leaseRowVersion, PimsSecurityDeposit deposit)
        {
            _user.ThrowIfNotAuthorized(Permissions.LeaseEdit);
            ValidateServiceCall(leaseId, leaseRowVersion);
            ValidateDeletionRules(deposit);

            _securityDepositRepository.Delete(deposit.SecurityDepositId);
            _securityDepositRepository.CommitTransaction();

            return _leaseRepository.Get(leaseId);
        }

        private void ValidateServiceCall(long leaseId, long leaseRowVersion)
        {
            if (!_leaseService.IsRowVersionEqual(leaseId, leaseRowVersion))
            {
                throw new DbUpdateConcurrencyException("Lease version mismatch.");
            }
        }

        private void ValidateDeletionRules(PimsSecurityDeposit deposit)
        {
            IEnumerable<PimsSecurityDepositReturn> depositReturns = _securityDepositReturnRepository.GetAllByDepositId(deposit.SecurityDepositId);
            if (depositReturns.Any())
            {
                throw new InvalidOperationException("Deposits with associated returns cannot be deleted.");
            }
        }
    }
}
