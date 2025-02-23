using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Pims.Core.Extensions;
using Pims.Dal.Constants;
using Pims.Dal.Entities;
using Pims.Dal.Exceptions;
using Pims.Dal.Helpers;
using Pims.Dal.Repositories;

namespace Pims.Api.Services
{
    public class LeaseService : BaseService, ILeaseService
    {
        private readonly ILogger _logger;
        private readonly ILeaseRepository _leaseRepository;
        private readonly ICoordinateTransformService _coordinateService;
        private readonly IPropertyRepository _propertyRepository;
        private readonly IPropertyLeaseRepository _propertyLeaseRepository;
        private readonly ILookupRepository _lookupRepository;
        private readonly IEntityNoteRepository _entityNoteRepository;

        public LeaseService(
            ClaimsPrincipal user,
            ILogger<ActivityService> logger,
            ILeaseRepository leaseRepository,
            ICoordinateTransformService coordinateTransformService,
            IPropertyRepository propertyRepository,
            IPropertyLeaseRepository propertyLeaseRepository,
            ILookupRepository lookupRepository,
            IEntityNoteRepository entityNoteRepositoryrvice)
            : base(user, logger)
        {
            _logger = logger;
            _leaseRepository = leaseRepository;
            _coordinateService = coordinateTransformService;
            _propertyRepository = propertyRepository;
            _propertyLeaseRepository = propertyLeaseRepository;
            _lookupRepository = lookupRepository;
            _entityNoteRepository = entityNoteRepositoryrvice;
        }

        public bool IsRowVersionEqual(long leaseId, long rowVersion)
        {
            long currentRowVersion = _leaseRepository.GetRowVersion(leaseId);
            return currentRowVersion == rowVersion;
        }

        public PimsLease GetById(long leaseId)
        {
            var lease = _leaseRepository.Get(leaseId);
            foreach (PimsPropertyLease propertyLease in lease.PimsPropertyLeases)
            {
                var property = propertyLease.Property;
                if (property?.Location != null)
                {
                    var newCoords = _coordinateService.TransformCoordinates(SpatialReference.BCALBERS, SpatialReference.WGS84, property.Location.Coordinate);
                    property.Location = GeometryHelper.CreatePoint(newCoords, SpatialReference.WGS84);
                }
            }
            return lease;
        }

        public PimsLease Add(PimsLease lease, IEnumerable<UserOverrideCode> userOverrides)
        {
            var leasesWithProperties = AssociatePropertyLeases(lease, userOverrides);
            return _leaseRepository.Add(leasesWithProperties);
        }

        public PimsLease Update(PimsLease lease, IEnumerable<UserOverrideCode> userOverrides)
        {
            var currentLease = _leaseRepository.GetNoTracking(lease.LeaseId);
            var currentProperties = _propertyLeaseRepository.GetAllByLeaseId(lease.LeaseId);

            if (currentLease.LeaseStatusTypeCode != lease.LeaseStatusTypeCode)
            {
                _entityNoteRepository.Add<PimsLeaseNote>(
                    new PimsLeaseNote()
                    {
                        LeaseId = currentLease.LeaseId,
                        AppCreateTimestamp = System.DateTime.Now,
                        AppCreateUserid = this.User.GetUsername(),
                        Note = new PimsNote()
                        {
                            IsSystemGenerated = true,
                            NoteTxt = $"Lease status changed from {currentLease.LeaseStatusTypeCode} to {lease.LeaseStatusTypeCode}",
                            AppCreateTimestamp = System.DateTime.Now,
                            AppCreateUserid = this.User.GetUsername(),
                        },
                    });
            }

            _leaseRepository.Update(lease, false);
            var leaseWithProperties = AssociatePropertyLeases(lease, userOverrides);
            _leaseRepository.UpdatePropertyLeases(lease.Internal_Id, lease.ConcurrencyControlNumber, leaseWithProperties.PimsPropertyLeases);

            _leaseRepository.UpdateLeaseConsultations(lease.Internal_Id, lease.ConcurrencyControlNumber, lease.PimsLeaseConsultations);

            List<PimsPropertyLease> differenceSet = currentProperties.Where(x => !lease.PimsPropertyLeases.Any(y => y.Internal_Id == x.Internal_Id)).ToList();
            foreach (var deletedProperty in differenceSet)
            {
                if (deletedProperty.Property.IsPropertyOfInterest.HasValue && deletedProperty.Property.IsPropertyOfInterest.Value)
                {
                    PimsProperty propertyWithAssociations = _propertyRepository.GetAllAssociationsById(deletedProperty.PropertyId);
                    var leaseAssociationCount = propertyWithAssociations.PimsPropertyLeases.Count;
                    var researchAssociationCount = propertyWithAssociations.PimsPropertyResearchFiles.Count;
                    var acquisitionAssociationCount = propertyWithAssociations.PimsPropertyAcquisitionFiles.Count;
                    if (researchAssociationCount + acquisitionAssociationCount == 0 && leaseAssociationCount <= 1 && deletedProperty?.Property?.IsPropertyOfInterest == true)
                    {
                        _leaseRepository.CommitTransaction(); // TODO: this can only be removed if cascade deletes are implemented. EF executes deletes in alphabetic order.
                        _propertyRepository.Delete(deletedProperty.Property);
                    }
                }
            }

            _leaseRepository.CommitTransaction();
            return _leaseRepository.GetNoTracking(lease.LeaseId);
        }

        /// <summary>
        /// Attempt to associate property leases with real properties in the system using the pid/pin identifiers.
        /// Do not attempt to update any preexisiting properties, simply refer to them by id.
        ///
        /// By default, do not allow a property with existing leases to be associated unless the userOverride flag is true.
        /// </summary>
        /// <param name="lease"></param>
        /// <param name="userOverrides"></param>
        /// <returns></returns>
        private PimsLease AssociatePropertyLeases(PimsLease lease, IEnumerable<UserOverrideCode> userOverrides)
        {
            MatchProperties(lease, userOverrides);

            foreach (var propertyLease in lease.PimsPropertyLeases)
            {
                PimsProperty property = propertyLease.Property;
                var existingPropertyLeases = _propertyLeaseRepository.GetAllByPropertyId(property.PropertyId);
                var isPropertyOnOtherLease = existingPropertyLeases.Any(p => p.LeaseId != lease.Internal_Id);
                var isPropertyOnThisLease = existingPropertyLeases.Any(p => p.LeaseId == lease.Internal_Id);
                if (isPropertyOnOtherLease && !isPropertyOnThisLease && !userOverrides.Contains(UserOverrideCode.AddPropertyToInventory))
                {
                    var genericOverrideErrorMsg = $"is attached to L-File # {existingPropertyLeases.FirstOrDefault().Lease.LFileNo}";
                    if (propertyLease?.Property?.Pin != null)
                    {
                        throw new UserOverrideException(UserOverrideCode.AddPropertyToInventory, $"PIN {propertyLease?.Property?.Pin.ToString() ?? string.Empty} {genericOverrideErrorMsg}");
                    }
                    if (propertyLease?.Property?.Pid != null)
                    {
                        throw new UserOverrideException(UserOverrideCode.AddPropertyToInventory, $"PID {propertyLease?.Property?.Pid.ToString() ?? string.Empty} {genericOverrideErrorMsg}");
                    }
                    throw new UserOverrideException(UserOverrideCode.AddPropertyToInventory, $"Lng/Lat {propertyLease?.Property?.Location.Coordinate.X.ToString(CultureInfo.CurrentCulture) ?? string.Empty}, " +
                        $"{propertyLease?.Property?.Location.Coordinate.Y.ToString(CultureInfo.CurrentCulture) ?? string.Empty} {genericOverrideErrorMsg}");
                }

                // If the property exist dont update it, just refer to it by id.
                if (property.Internal_Id != 0)
                {
                    propertyLease.PropertyId = property.PropertyId;
                    propertyLease.Property = null;
                }
            }

            return lease;
        }

        private void UpdateLocation(PimsProperty leaseProperty, ref PimsProperty propertyToUpdate, IEnumerable<UserOverrideCode> userOverrides)
        {
            if (propertyToUpdate.Location == null)
            {
                if (userOverrides.Contains(UserOverrideCode.AddLocationToProperty))
                {
                    // convert spatial location from lat/long (4326) to BC Albers (3005) for database storage
                    var geom = leaseProperty.Location;
                    if (geom.SRID != SpatialReference.BCALBERS)
                    {
                        var newCoords = _coordinateService.TransformCoordinates(geom.SRID, SpatialReference.BCALBERS, geom.Coordinate);
                        propertyToUpdate.Location = GeometryHelper.CreatePoint(newCoords, SpatialReference.BCALBERS);
                        _propertyRepository.Update(propertyToUpdate, overrideLocation: true);
                    }
                }
                else
                {
                    throw new UserOverrideException(UserOverrideCode.AddLocationToProperty, "The selected property already exists in the system's inventory. However, the record is missing spatial details.\n\n To add the property, the spatial details for this property will need to be updated. The system will attempt to update the property record with spatial information from the current selection.");
                }
            }
        }

        private void MatchProperties(PimsLease lease, IEnumerable<UserOverrideCode> userOverrides)
        {
            foreach (var leaseProperty in lease.PimsPropertyLeases)
            {
                if (leaseProperty.Property.Pid.HasValue)
                {
                    var pid = leaseProperty.Property.Pid.Value;
                    try
                    {
                        var foundProperty = _propertyRepository.GetByPid(pid);
                        leaseProperty.PropertyId = foundProperty.Internal_Id;
                        UpdateLocation(leaseProperty.Property, ref foundProperty, userOverrides);
                        leaseProperty.Property = foundProperty;
                    }
                    catch (KeyNotFoundException)
                    {
                        _logger.LogDebug("Adding new property with pid:{pid}", pid);
                        PopulateNewProperty(leaseProperty.Property);
                    }
                }
                else if (leaseProperty.Property.Pin.HasValue)
                {
                    var pin = leaseProperty.Property.Pin.Value;
                    try
                    {
                        var foundProperty = _propertyRepository.GetByPin(pin);
                        leaseProperty.PropertyId = foundProperty.Internal_Id;
                        UpdateLocation(leaseProperty.Property, ref foundProperty, userOverrides);
                        leaseProperty.Property = foundProperty;
                    }
                    catch (KeyNotFoundException)
                    {
                        _logger.LogDebug("Adding new property with pin:{pin}", pin);
                        PopulateNewProperty(leaseProperty.Property);
                    }
                }
                else
                {
                    _logger.LogDebug("Adding new property without a pid or pin");
                    PopulateNewProperty(leaseProperty.Property);
                }
            }
        }

        private void PopulateNewProperty(PimsProperty property)
        {
            property.PropertyClassificationTypeCode = "UNKNOWN";
            property.PropertyDataSourceEffectiveDate = System.DateTime.Now;
            property.PropertyDataSourceTypeCode = "PMBC";

            property.PropertyTypeCode = "UNKNOWN";

            property.PropertyStatusTypeCode = "UNKNOWN";
            property.SurplusDeclarationTypeCode = "UNKNOWN";

            property.IsPropertyOfInterest = false;

            if (property.Address != null)
            {
                var provinceId = _lookupRepository.GetAllProvinces().FirstOrDefault(p => p.ProvinceStateCode == "BC")?.Id;
                if (provinceId.HasValue)
                {
                    property.Address.ProvinceStateId = provinceId.Value;
                }
                property.Address.CountryId = _lookupRepository.GetAllCountries().FirstOrDefault(p => p.CountryCode == "CA")?.Id;
            }

            // convert spatial location from lat/long (4326) to BC Albers (3005) for database storage
            var geom = property.Location;
            if (geom.SRID != SpatialReference.BCALBERS)
            {
                var newCoords = _coordinateService.TransformCoordinates(geom.SRID, SpatialReference.BCALBERS, geom.Coordinate);
                property.Location = GeometryHelper.CreatePoint(newCoords, SpatialReference.BCALBERS);
            }
        }
    }
}
