using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;
using Pims.Core.Extensions;
using Pims.Dal.Entities;
using Pims.Dal.Entities.Models;
using Pims.Dal.Helpers.Extensions;
using Pims.Dal.Security;

namespace Pims.Dal.Repositories
{
    /// <summary>
    /// PropertyRepository class, provides a service layer to interact with properties within the datasource.
    /// </summary>
    public class PropertyRepository : BaseRepository<PimsProperty>, IPropertyRepository
    {
        #region Constructors

        /// <summary>
        /// Creates a new instance of a PropertyRepository, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public PropertyRepository(PimsContext dbContext, ClaimsPrincipal user, ILogger<PropertyRepository> logger)
            : base(dbContext, user, logger)
        {
        }
        #endregion

        #region Methods

        /// <summary>
        /// Returns the total number of properties in the database.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            return this.Context.PimsProperties.Count();
        }

        /// <summary>
        /// Get an array of properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning organization.
        /// Note that the 'parcelFilter' will control the 'page' and 'quantity'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public IEnumerable<PimsProperty> GetAllByFilter(PropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid())
            {
                throw new ArgumentException("Argument must have a valid filter", nameof(filter));
            }

            var query = this.Context.GeneratePropertyQuery(this.User, filter);
            var properties = query.ToArray();

            // TODO: PSP-4427 Add optional paging ability to query.
            return properties;
        }

        /// <summary>
        /// Get a page with an array of properties within the specified filters.
        /// Will not return sensitive properties unless the user has the `sensitive-view` claim and belongs to the owning organization.
        /// Note that the 'parcelFilter' will control the 'page' and 'quantity'.
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public Paged<PimsProperty> GetPage(PropertyFilter filter)
        {
            this.User.ThrowIfNotAuthorized(Permissions.PropertyView);
            filter.ThrowIfNull(nameof(filter));
            if (!filter.IsValid())
            {
                throw new ArgumentException("Argument must have a valid filter", nameof(filter));
            }

            var skip = (filter.Page - 1) * filter.Quantity;
            var query = this.Context.GeneratePropertyQuery(this.User, filter);
            var items = query
                .Skip(skip)
                .Take(filter.Quantity)
                .ToArray();

            return new Paged<PimsProperty>(items, filter.Page, filter.Quantity, query.Count());
        }

        /// <summary>
        /// Get the property for the specified primary key 'id' value.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public PimsProperty GetById(long id)
        {
            this.User.ThrowIfNotAllAuthorized(Permissions.PropertyView);

            var property = this.Context.PimsProperties
                .Include(p => p.DistrictCodeNavigation)
                .Include(p => p.RegionCodeNavigation)
                .Include(p => p.PropertyTypeCodeNavigation)
                .Include(p => p.PropertyStatusTypeCodeNavigation)
                .Include(p => p.PropertyDataSourceTypeCodeNavigation)
                .Include(p => p.PropertyClassificationTypeCodeNavigation)
                .Include(p => p.PimsPropPropAnomalyTypes)
                    .ThenInclude(t => t.PropertyAnomalyTypeCodeNavigation)
                .Include(p => p.PimsPropPropRoadTypes)
                    .ThenInclude(t => t.PropertyRoadTypeCodeNavigation)
                .Include(p => p.PimsPropPropAdjacentLandTypes)
                    .ThenInclude(t => t.PropertyAdjacentLandTypeCodeNavigation)
                .Include(p => p.PimsPropPropTenureTypes)
                    .ThenInclude(t => t.PropertyTenureTypeCodeNavigation)
                .Include(p => p.PropertyAreaUnitTypeCodeNavigation)
                .Include(p => p.VolumetricTypeCodeNavigation)
                .Include(p => p.VolumeUnitTypeCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.RegionCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.DistrictCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.ProvinceState)
                .Include(p => p.Address)
                    .ThenInclude(a => a.Country)
                .Include(p => p.PimsPropertyLeases)
                    .ThenInclude(l => l.Lease)
                    .ThenInclude(l => l.PimsLeaseTenants)
                .Include(p => p.PimsPropertyLeases)
                    .ThenInclude(l => l.Lease)
                    .ThenInclude(l => l.PimsLeaseTenants)
                    .ThenInclude(l => l.Person)
                .Include(p => p.PimsPropertyLeases)
                    .ThenInclude(l => l.Lease)
                    .ThenInclude(l => l.PimsLeaseTenants)
                    .ThenInclude(l => l.Organization)
                .FirstOrDefault(p => p.PropertyId == id) ?? throw new KeyNotFoundException();
            return property;
        }

        /// <summary>
        /// Get all of the properties for the specified primary keys 'ids' value.
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public List<PimsProperty> GetAllByIds(List<long> ids)
        {
            this.User.ThrowIfNotAllAuthorized(Permissions.PropertyView);

            var property = this.Context.PimsProperties
                .Include(p => p.DistrictCodeNavigation)
                .Include(p => p.RegionCodeNavigation)
                .Include(p => p.PropertyTypeCodeNavigation)
                .Include(p => p.PropertyStatusTypeCodeNavigation)
                .Include(p => p.PropertyDataSourceTypeCodeNavigation)
                .Include(p => p.PropertyClassificationTypeCodeNavigation)
                .Include(p => p.PimsPropPropAnomalyTypes)
                    .ThenInclude(t => t.PropertyAnomalyTypeCodeNavigation)
                .Include(p => p.PimsPropPropRoadTypes)
                    .ThenInclude(t => t.PropertyRoadTypeCodeNavigation)
                .Include(p => p.PimsPropPropAdjacentLandTypes)
                    .ThenInclude(t => t.PropertyAdjacentLandTypeCodeNavigation)
                .Include(p => p.PimsPropPropTenureTypes)
                    .ThenInclude(t => t.PropertyTenureTypeCodeNavigation)
                .Include(p => p.PropertyAreaUnitTypeCodeNavigation)
                .Include(p => p.VolumetricTypeCodeNavigation)
                .Include(p => p.VolumeUnitTypeCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.RegionCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.DistrictCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.ProvinceState)
                .Include(p => p.Address)
                    .ThenInclude(a => a.Country)
                .Where(p => ids.Any(s => s == p.PropertyId))
                .ToList();
            return property;
        }

        /// <summary>
        /// Get the property for the specified PID string value.
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public PimsProperty GetByPid(string pid)
        {
            this.User.ThrowIfNotAllAuthorized(Permissions.PropertyView);
            var parsedPid = pid.ConvertPID();

            return GetByPid(parsedPid);
        }

        /// <summary>
        /// Get the property for the specified PID value.
        /// </summary>
        /// <param name="pid"></param>
        /// <returns></returns>
        public PimsProperty GetByPid(int pid)
        {
            this.User.ThrowIfNotAllAuthorized(Permissions.PropertyView);

            var property = this.Context.PimsProperties.AsNoTracking()
                .Include(p => p.DistrictCodeNavigation)
                .Include(p => p.RegionCodeNavigation)
                .Include(p => p.PropertyTypeCodeNavigation)
                .Include(p => p.PropertyStatusTypeCodeNavigation)
                .Include(p => p.PropertyDataSourceTypeCodeNavigation)
                .Include(p => p.PropertyClassificationTypeCodeNavigation)
                .Include(p => p.PimsPropPropAnomalyTypes)
                    .ThenInclude(t => t.PropertyAnomalyTypeCodeNavigation)
                .Include(p => p.PimsPropPropRoadTypes)
                    .ThenInclude(t => t.PropertyRoadTypeCodeNavigation)
                .Include(p => p.PimsPropPropAdjacentLandTypes)
                    .ThenInclude(t => t.PropertyAdjacentLandTypeCodeNavigation)
                .Include(p => p.PimsPropPropTenureTypes)
                    .ThenInclude(t => t.PropertyTenureTypeCodeNavigation)
                .Include(p => p.PropertyAreaUnitTypeCodeNavigation)
                .Include(p => p.VolumetricTypeCodeNavigation)
                .Include(p => p.VolumeUnitTypeCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.RegionCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.DistrictCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.ProvinceState)
                .Include(p => p.Address)
                    .ThenInclude(a => a.Country)
                .FirstOrDefault(p => p.Pid == pid) ?? throw new KeyNotFoundException();
            return property;
        }

        /// <summary>
        /// Get the property for the specified PIN value.
        /// </summary>
        /// <param name="pin"></param>
        /// <returns></returns>
        public PimsProperty GetByPin(int pin)
        {
            this.User.ThrowIfNotAllAuthorized(Permissions.PropertyView);

            var property = this.Context.PimsProperties.AsNoTracking()
                .Include(p => p.DistrictCodeNavigation)
                .Include(p => p.RegionCodeNavigation)
                .Include(p => p.PropertyTypeCodeNavigation)
                .Include(p => p.PropertyStatusTypeCodeNavigation)
                .Include(p => p.PropertyDataSourceTypeCodeNavigation)
                .Include(p => p.PropertyClassificationTypeCodeNavigation)
                .Include(p => p.PimsPropPropAnomalyTypes)
                    .ThenInclude(t => t.PropertyAnomalyTypeCodeNavigation)
                .Include(p => p.PimsPropPropRoadTypes)
                    .ThenInclude(t => t.PropertyRoadTypeCodeNavigation)
                .Include(p => p.PimsPropPropAdjacentLandTypes)
                    .ThenInclude(t => t.PropertyAdjacentLandTypeCodeNavigation)
                .Include(p => p.PimsPropPropTenureTypes)
                    .ThenInclude(t => t.PropertyTenureTypeCodeNavigation)
                .Include(p => p.PropertyAreaUnitTypeCodeNavigation)
                .Include(p => p.VolumetricTypeCodeNavigation)
                .Include(p => p.VolumeUnitTypeCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.RegionCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.DistrictCodeNavigation)
                .Include(p => p.Address)
                    .ThenInclude(a => a.ProvinceState)
                .Include(p => p.Address)
                    .ThenInclude(a => a.Country)
                .FirstOrDefault(p => p.Pin == pin) ?? throw new KeyNotFoundException();
            return property;
        }

        public PimsProperty TryGetByLocation(Geometry location)
        {
            return this.Context.PimsProperties
                    .AsNoTracking()
                    .Include(p => p.PimsPropertyLeases)
                    .Where(p => (p != null && p.Location.IsWithinDistance(location, 1)))
                    .OrderBy(p => p.Location.Distance(location))
                    .FirstOrDefault();
        }

        /// <summary>
        /// Get the property for the specified id value.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public PimsProperty GetAllAssociationsById(long id)
        {
            PimsProperty property = this.Context.PimsProperties.AsNoTracking()
                .Include(p => p.PimsPropertyLeases)
                    .ThenInclude(pl => pl.Lease)
                    .ThenInclude(l => l.LeaseStatusTypeCodeNavigation)
                .Include(p => p.PimsPropertyResearchFiles)
                    .ThenInclude(pr => pr.ResearchFile)
                    .ThenInclude(r => r.ResearchFileStatusTypeCodeNavigation)
                .Include(p => p.PimsPropertyAcquisitionFiles)
                    .ThenInclude(pa => pa.AcquisitionFile)
                    .ThenInclude(a => a.AcquisitionFileStatusTypeCodeNavigation)
                .FirstOrDefault(p => p.PropertyId == id);

            return property;
        }

        /// <summary>
        /// Update the passed property in the database assuming the user has the required claims.
        /// </summary>
        /// <param name="property"></param>
        /// <returns></returns>
        public PimsProperty Update(PimsProperty property, bool overrideLocation = false)
        {
            property.ThrowIfNull(nameof(property));

            var propertyId = property.Internal_Id;
            var existingProperty = this.Context.PimsProperties
                .Include(p => p.Address)
                .FirstOrDefault(p => p.PropertyId == propertyId) ?? throw new KeyNotFoundException();

            // ignore a number of properties that we don't the frontend to override - for now
            property.Boundary = existingProperty.Boundary;
            if (!overrideLocation)
            {
                property.Location = existingProperty.Location;
            }
            property.AddressId = existingProperty.AddressId;
            property.PropertyDataSourceEffectiveDate = existingProperty.PropertyDataSourceEffectiveDate;
            property.PropertyDataSourceTypeCode = existingProperty.PropertyDataSourceTypeCode;
            property.PropertyClassificationTypeCode = existingProperty.PropertyClassificationTypeCode;
            property.SurplusDeclarationTypeCode = existingProperty.SurplusDeclarationTypeCode;
            property.SurplusDeclarationComment = existingProperty.SurplusDeclarationComment;
            property.SurplusDeclarationDate = existingProperty.SurplusDeclarationDate;
            property.IsOwned = existingProperty.IsOwned;
            property.IsPropertyOfInterest = existingProperty.IsPropertyOfInterest;
            property.IsVisibleToOtherAgencies = existingProperty.IsVisibleToOtherAgencies;
            property.IsSensitive = existingProperty.IsSensitive;

            if (property.PphStatusTypeCode != existingProperty.PphStatusTypeCode)
            {
                property.PphStatusUpdateTimestamp = DateTime.UtcNow;
                property.PphStatusUpdateUserid = User.GetUsername();
                property.PphStatusUpdateUserGuid = User.GetUserKey();
            }
            else
            {
                property.PphStatusUpdateTimestamp = existingProperty.PphStatusUpdateTimestamp;
                property.PphStatusUpdateUserid = existingProperty.PphStatusUpdateUserid;
                property.PphStatusUpdateUserGuid = existingProperty.PphStatusUpdateUserGuid;
            }

            // update main entity - PimsProperty
            Context.Entry(existingProperty).CurrentValues.SetValues(property);

            // add/update property address
            var newAddress = property.Address;
            if (newAddress != null)
            {
                existingProperty.Address ??= new PimsAddress();
                Context.Entry(existingProperty.Address).CurrentValues.SetValues(newAddress);
            }
            else
            {
                // remove the linkage to existing address
                existingProperty.Address = null;
            }

            // update direct relationships - anomalies, tenures, etc
            Context.UpdateChild<PimsProperty, long, PimsPropPropAnomalyType, long>(p => p.PimsPropPropAnomalyTypes, propertyId, property.PimsPropPropAnomalyTypes.ToArray());
            Context.UpdateChild<PimsProperty, long, PimsPropPropAdjacentLandType, long>(p => p.PimsPropPropAdjacentLandTypes, propertyId, property.PimsPropPropAdjacentLandTypes.ToArray());
            Context.UpdateChild<PimsProperty, long, PimsPropPropRoadType, long>(p => p.PimsPropPropRoadTypes, propertyId, property.PimsPropPropRoadTypes.ToArray());
            Context.UpdateChild<PimsProperty, long, PimsPropPropTenureType, long>(p => p.PimsPropPropTenureTypes, propertyId, property.PimsPropPropTenureTypes.ToArray());

            return existingProperty;
        }

        /// <summary>
        /// Delete a property. Note that this method will fail unless all dependencies are removed first.
        /// </summary>
        /// <param name="property"></param>
        public void Delete(PimsProperty property)
        {
            this.Context.Entry(new PimsProperty() { PropertyId = property.PropertyId }).State = EntityState.Deleted;
        }

        /// <summary>
        /// Update the passed property in the database so that it is classified as "core inventory" in PIMS.
        /// </summary>
        /// <param name="property">The property to update.</param>
        /// <returns>The updated property.</returns>
        public PimsProperty TransferToCoreInventory(PimsProperty property)
        {
            property.ThrowIfNull(nameof(property));

            var existingProperty = Context.PimsProperties
                .FirstOrDefault(p => p.PropertyId == property.Internal_Id) ?? throw new KeyNotFoundException();

            existingProperty.IsPropertyOfInterest = false;
            existingProperty.IsOwned = true;
            return existingProperty;
        }

        #endregion
    }
}
