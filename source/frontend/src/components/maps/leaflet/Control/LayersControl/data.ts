import { MAP_MAX_NATIVE_ZOOM, MAP_MAX_ZOOM } from 'constants/strings';

import { ILayerItem } from './types';

export const layersTree: ILayerItem[] = [
  {
    key: 'Administrative Boundaries',
    label: 'Administrative Boundaries',
    on: false,
    nodes: [
      {
        key: 'currentEconomicRegions',
        label: 'Current Census Economic Regions',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW/ows?',
        layers: 'pub:WHSE_HUMAN_CULTURAL_ECONOMIC.CEN_ECONOMIC_REGIONS_SVW',
        transparent: true,
        format: 'image/png',
        zIndex: 0,
        id: 'currentEconomicRegions',
        color: '#bbdefb',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'moti',
        label: 'MOTI Regions',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.TADM_MOT_REGIONAL_BNDRY_POLY/ows?',
        layers: 'pub:WHSE_ADMIN_BOUNDARIES.TADM_MOT_REGIONAL_BNDRY_POLY',
        transparent: true,
        opacity: 0.9,
        format: 'image/png',
        zIndex: 21,
        id: 'moti',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'motiHighwayDistricts',
        label: 'MOTI Highway Districts',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.TADM_MOT_DISTRICT_BNDRY_POLY/ows?',
        layers: 'pub:WHSE_ADMIN_BOUNDARIES.TADM_MOT_DISTRICT_BNDRY_POLY',
        transparent: true,
        opacity: 0.9,
        format: 'image/png',
        zIndex: 22,
        id: 'motiHighwayDistricts',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'municipalities',
        label: 'Municipalities',
        on: false,
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_MUNICIPALITIES_SP/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 20,
        id: 'municipalityLayer',
        color: '#b39ddb',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'regionalDistricts ',
        label: 'Regional Districts ',
        on: false,
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_REGIONAL_DISTRICTS_SP',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.ABMS_REGIONAL_DISTRICTS_SP/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 19,
        id: 'regionalDistricts',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
  {
    // The actual layers are populated via tenant.json configuration for each live environment
    key: 'legalHighwayResearch',
    label: 'Legal Highway Research',
    on: false,
    nodes: [],
  },
  {
    key: 'firstNations',
    label: 'First Nations',
    on: false,
    nodes: [
      {
        key: 'firstNationsReserves',
        label: 'First Nations reserves',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP/ows?',
        layers: 'pub:WHSE_ADMIN_BOUNDARIES.ADM_INDIAN_RESERVES_BANDS_SP',
        transparent: true,
        format: 'image/png',
        zIndex: 10,
        id: 'firstNationsReserves',
        color: '#ebe0d7',
        opacity: 0.9,
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'firstNationTreatyAreas',
        label: 'First Nation Treaty Areas',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_AREA_SP/ows?',
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_AREA_SP',
        transparent: true,
        format: 'image/png',
        zIndex: 10,
        id: 'firstNationTreatyAreas',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'firstNationTreatyLands',
        label: 'First Nations Treaty Lands',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_LAND_SP/ows?',
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_LAND_SP',
        transparent: true,
        format: 'image/png',
        zIndex: 10,
        id: 'firstNationTreatyLands',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'firstNationTreatyRelatedLands',
        label: 'First Nations Treaty Related Lands',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_RELATED_LAND_SP/ows?',
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_RELATED_LAND_SP',
        transparent: true,
        format: 'image/png',
        zIndex: 10,
        id: 'firstNationTreatyRelatedLands',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'firstNationTreatySideAgreement',
        label: 'First Nation Treaty Side Agreements',
        on: false,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_SIDE_AGREEMENTS_SP/ows?',
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.FNT_TREATY_SIDE_AGREEMENTS_SP',
        transparent: true,
        format: 'image/png',
        zIndex: 10,
        id: 'firstNationTreatySideAgreement',
        color: '#ffc5ae',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
  {
    key: 'landOwnership',
    label: 'Land Ownership',
    on: false,
    nodes: [
      {
        key: 'crownLeases',
        label: 'Crown Leases',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_CROWN_LEASES_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_LEASES_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 7,
        id: 'crownLeases',
        color: '#8dc2d5',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'crownInventory',
        label: 'Crown Inventory',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_INVENTORY_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 6,
        id: 'crownInventory',
        color: '#fcc1eb',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'crownInclusions',
        label: 'Crown Inclusions',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_CROWN_INCLUSIONS_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_INCLUSIONS_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 5,
        id: 'crownInclusions',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'crownLandLicenses',
        label: 'Crown Land Licenses',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_CROWN_LICENSES_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_LICENSES_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 5,
        id: 'crownLandLicenses',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'crownTenures',
        label: 'Crown Tenures',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_CROWN_TENURES_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_CROWN_TENURES_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 5,
        id: 'crownTenures',
        color: '#E83FFF',
        styles: 2216,
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'parcelBoundaries',
        label: 'Parcel Boundaries',
        on: true,
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/ows?',
        layers: 'pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW',
        transparent: true,
        format: 'image/png',
        zIndex: 18,
        id: 'parcelLayer',
        color: '#ff9800',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
  {
    key: 'zoning',
    label: 'Zoning',
    on: false,
    nodes: [
      {
        key: 'agriculturalLandReserve',
        label: 'Agricultural Land Reserve',
        on: false,
        layers: 'pub:WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_POLYS',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_LEGAL_ADMIN_BOUNDARIES.OATS_ALR_POLYS/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 4,
        id: 'agriculturalLandReserve',
        opacity: 1,
        color: '#00b300',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
  {
    key: 'electoral',
    label: 'Electoral',
    on: false,
    nodes: [
      {
        key: 'currentElectoralDistricts',
        label: 'Current Provincial Electoral Districts of British Columbia',
        on: false,
        layers: 'pub:WHSE_ADMIN_BOUNDARIES.EBC_PROV_ELECTORAL_DIST_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.EBC_PROV_ELECTORAL_DIST_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 4,
        id: 'currentElectoralDistricts',
        color: '#da2223',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
  {
    key: 'federal_bc_parks',
    label: 'Federal/BC Parks',
    on: false,
    nodes: [
      {
        key: 'federalParks',
        label: 'Federal Parks',
        on: false,
        layers: 'pub:WHSE_ADMIN_BOUNDARIES.CLAB_NATIONAL_PARKS',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.CLAB_NATIONAL_PARKS/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 4,
        id: 'federalParks',
        color: '#53B60A',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
      {
        key: 'bcParks',
        label: 'BC Parks',
        on: false,
        layers: 'pub:WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW',
        url: 'https://openmaps.gov.bc.ca/geo/pub/WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW/ows?',
        transparent: true,
        format: 'image/png',
        zIndex: 4,
        id: 'bcParks',
        color: '#1FB60A',
        maxNativeZoom: MAP_MAX_NATIVE_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      },
    ],
  },
];
