import { FeatureCollection, Point } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';

import { PeerMapScopeMapInfo, ExchangeMapSummary, GenericKeyValue } from 'libs/models/';

export class MapHelper {

  static buildMapFilter(currentState, mapProps) {

    const swappedBounds = this.swapBounds(mapProps.bounds);

    return {
      ...currentState.mapFilter,
      TopLeft: swappedBounds.TopLeft,
      BottomRight: swappedBounds.BottomRight,
      ClusterPrecision: this.getClusterPrecision(mapProps.zoom, currentState.zoomPrecisionDictionary)
    };
  }

  static getMapDetailsFromScope(scope: PeerMapScopeMapInfo, isDataCut: boolean = false): any {
    const scopeCriteria: PeerMapScopeMapInfo = scope;
    const mapResponse = scopeCriteria.MapResponse;
    const mapSummary: ExchangeMapSummary = mapResponse.MapSummary;
    const tl = isDataCut ? mapSummary.TopLeft : scopeCriteria.ScopeTopLeft;
    const br = isDataCut ? mapSummary.BottomRight : scopeCriteria.ScopeBottomRight;
    const mapCollection: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: mapResponse.FeatureCollection
    };
    const boundsForOneMapCopy = [tl.Lon, br.Lat, br.Lon, tl.Lat];
    const lngLatBounds = new LngLatBounds(
      [boundsForOneMapCopy[0], boundsForOneMapCopy[1]],
      [boundsForOneMapCopy[2], boundsForOneMapCopy[3]]
    );
    return {
      MapCollection: mapCollection,
      MapSummary: mapSummary,
      MapBounds: boundsForOneMapCopy,
      Centroid: lngLatBounds.getCenter().toArray(),
      ZoomLevel: scopeCriteria.ZoomLevel,
      MapFilter: {
        TopLeft: tl,
        BottomRight: br,
        ClusterPrecision: scopeCriteria.ClusterPrecision
      }
    };
  }

 public static MapSummaryHasBounds(mapSummary: ExchangeMapSummary): boolean {
    const hasNewTLBounds = !!mapSummary.TopLeft && !!mapSummary.TopLeft.Lat && !!mapSummary.TopLeft.Lon;
    const hasNewBRBounds = !!mapSummary.BottomRight && !!mapSummary.BottomRight.Lat && !!mapSummary.BottomRight.Lon;
    return hasNewTLBounds && hasNewBRBounds;
  }

  static setBounds(mapSummary: ExchangeMapSummary, currentState: any, newState: any): any {
    if (currentState.isInitialLoad && MapHelper.MapSummaryHasBounds(mapSummary)) {
      const newTL = mapSummary.TopLeft;
      const newBR = mapSummary.BottomRight;
      newState.mapBounds = [newTL.Lon, newBR.Lat, newBR.Lon, newTL.Lat];
      newState.mapFilter.TopLeft = newTL;
      newState.mapFilter.BottomRight = newBR;
    }
    return newState;
  }

  private static swapBounds(bounds: any): any {
    const ne = bounds._ne;
    const sw = bounds._sw;
    const swappedBounds = {
      TopLeft: {
        Lat: this.enforceBoundsLimit(ne.lat),
        Lon: this.enforceBoundsLimit(sw.lng)
      },
      BottomRight: {
        Lat: this.enforceBoundsLimit(sw.lat),
        Lon: this.enforceBoundsLimit(ne.lng)
      }
    };
    return swappedBounds;
  }

  private static enforceBoundsLimit(coordinate: number) {
    return coordinate > 180 ? 180 : coordinate < -180 ? -180 : coordinate;
  }

  private static getClusterPrecision(zoomLevel: number, zoomPrecisionDictionary: GenericKeyValue<number, number>[] | null) {
    if (zoomPrecisionDictionary === null) {
      return this.getDefaultClusterPrecision(zoomLevel);
    }
    const castedZoomPrecisionDictionary = Object.keys(zoomPrecisionDictionary).map(function(key) {
      return {
        Key: Number(key),
        Value: Number(zoomPrecisionDictionary[key])
      };
    });
    const minPrecision = 1;
    const maxPrecision = 12;

    const nextIndex = castedZoomPrecisionDictionary.findIndex(zp => zp.Key > zoomLevel);
    if (nextIndex <= 0) {
      return nextIndex < 0 ? maxPrecision : minPrecision;
    }

    const prevValFromDictionary = castedZoomPrecisionDictionary[nextIndex - 1].Value;
    const val = prevValFromDictionary > maxPrecision ? maxPrecision : prevValFromDictionary;
    return val < minPrecision ? minPrecision : val;
  }

  private static getDefaultClusterPrecision(zoomLevel: number): 1|2|3|4|5|6|7 {
    const zoomToGeoHashPrecision = {
      0: 0,
      1: 1,
      2: 2,
      3: 2,
      4: 3,
      5: 3,
      6: 3,
      7: 4,
      8: 5,
      9: 5,
      10: 5,
      11: 6,
      12: 6,
      13: 6,
      14: 7,
      15: 7,
      16: 7,
      17: 7,
      18: 7,
      19: 7,
      20: 7,
      21: 7
    };

    return zoomToGeoHashPrecision[Math.round(zoomLevel)];
  }
}
