import { ICluster, PointFeature } from 'components/maps/types';
import { DraftCircleNumber } from 'components/propertySelector/selectedPropertyList/DraftCircleNumber';
import { IProperty } from 'interfaces';
import L, { DivIcon, GeoJSON, LatLngExpression, Layer, Map, Marker } from 'leaflet';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Supercluster from 'supercluster';

// parcel icon (green)
export const parcelIcon = L.icon({
  iconUrl: require('assets/images/pins/land-reg.png') ?? 'assets/images/pins/land-reg.png',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// not owned property icon (red)
export const notOwnedPropertyIcon = L.icon({
  iconUrl:
    require('assets/images/pins/marker-info-orange.png') ??
    'assets/images/pins/marker-info-orange.png',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// not owned property icon (orange)
export const notOwnedPropertyIconSelect = L.icon({
  iconUrl:
    require('assets/images/pins/marker-info-orange-highlight.png') ??
    'assets/images/pins/marker-info-orange-highlight.png',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// property of interest icon (blue) highlighted
export const propertyOfInterestIcon = L.icon({
  iconUrl: require('assets/images/pins/land-poi.svg').default ?? 'assets/images/pins/land-poi.svg',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// property of interest icon (blue) highlighted
export const propertyOfInterestIconSelect = L.icon({
  iconUrl:
    require('assets/images/pins/land-poi-selected.svg').default ??
    'assets/images/pins/land-poi-selected.svg',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// property with payable lease icon (purple) highlighted
export const propertyWithLeaseIcon = L.icon({
  iconUrl:
    require('assets/images/pins/land-lease.svg').default ?? 'assets/images/pins/land-lease.svg',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// property with payable lease icon (purple) highlighted
export const propertyWithLeaseIconSelect = L.icon({
  iconUrl:
    require('assets/images/pins/land-lease-selected.svg').default ??
    'assets/images/pins/land-lease-selected.svg',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// parcel icon (green) highlighted
export const parcelIconSelect = L.icon({
  iconUrl:
    require('assets/images/pins/land-reg-highlight.png') ??
    'assets/images/pins/land-reg-highlight.png',
  shadowUrl: require('assets/images/pins/marker-shadow.png') ?? 'marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Creates map points (in GeoJSON format) for further clustering by `supercluster`
 * @param properties
 */
export const createPoints = (properties: IProperty[], type: string = 'Point') =>
  properties.map(x => {
    return {
      type: 'Feature',
      properties: {
        ...x,
        cluster: false,
        PROPERTY_ID: x.id,
      },
      geometry: {
        type: type,
        coordinates: [x.longitude, x.latitude],
      },
    } as PointFeature;
  });

/**
 * This function defines how GeoJSON points spawn Leaflet layers on the map.
 * It is called internally by the `GeoJSON` leaflet component.
 * @param feature
 * @param latlng
 */
export const pointToLayer = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const { cluster: isCluster } = feature?.properties as Supercluster.ClusterProperties;
  if (!!isCluster) {
    return createClusterMarker(feature, latlng);
  }
  // we have a single point to render
  return createSingleMarker(feature, latlng);
};

/**
 * Get an icon type for the specified cluster property details.
 */
export const getMarkerIcon = (feature: ICluster, selected?: boolean) => {
  if (feature.properties.IS_PAYABLE_LEASE || feature.properties.isPayableLease) {
    if (selected) {
      return propertyWithLeaseIconSelect;
    } else {
      return propertyWithLeaseIcon;
    }
  }

  if (feature.properties.IS_PROPERTY_OF_INTEREST || feature.properties.isPropertyOfInterest) {
    if (selected) {
      return propertyOfInterestIconSelect;
    } else {
      return propertyOfInterestIcon;
    }
  }

  if (feature.properties.PROPERTY_ID || feature.properties.id) {
    if (selected) {
      return parcelIconSelect;
    }
  } else {
    if (selected) {
      return notOwnedPropertyIconSelect;
    }
    return notOwnedPropertyIcon;
  }
  return parcelIcon;
};

// parcel icon (green) highlighted
export const getDraftIcon = (text: string) => {
  return L.divIcon({
    iconSize: [29, 45],
    iconAnchor: [15, 45],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    html: ReactDOMServer.renderToStaticMarkup(<DraftCircleNumber text={text} />),
  });
};

/**
 * Creates a map pin for a single point; e.g. a parcel
 * @param feature the geojson object
 * @param latlng the point position
 */
export const createSingleMarker = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const icon = getMarkerIcon(feature);
  return new Marker(latlng, { icon });
};

// Internal cache of cluster icons to avoid re-creating the same icon over and over again.
const iconsCache: Record<number, DivIcon> = {};

/**
 * Creates a marker for clusters on the map
 * @param feature the cluster geojson object
 * @param latlng the cluster position
 */
export const createClusterMarker = (feature: ICluster, latlng: LatLngExpression): Layer => {
  const {
    cluster: isCluster,
    point_count: count,
    point_count_abbreviated: displayValue,
  } = feature?.properties as Supercluster.ClusterProperties;

  if (!isCluster) {
    return null as unknown as Layer;
  }

  const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
  let icon: DivIcon;

  if (!iconsCache[count]) {
    iconsCache[count] = new DivIcon({
      html: `<div><span>${displayValue}</span></div>`,
      className: `marker-cluster marker-cluster-${size}`,
      iconSize: [40, 40],
    });
  }

  icon = iconsCache[count];
  return new Marker(latlng, { icon });
};

/** Zooms to a cluster */
export const zoomToCluster = (cluster: ICluster, expansionZoom: number, map: Map) => {
  const latlng = GeoJSON.coordsToLatLng(cluster?.geometry?.coordinates as [number, number]);
  map?.setView(latlng, expansionZoom, { animate: true });
};
