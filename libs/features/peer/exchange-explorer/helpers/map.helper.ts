import { FeatureCollection, Point } from 'geojson';
import { LngLatBounds } from 'mapbox-gl';

import { ExchangeMapSummary, MapGeoData } from 'libs/models/';
import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export class MapHelper {

  static buildMapFilter(currentState, mapProps) {

    const swappedBounds = this.swapBounds(mapProps.bounds);

    return {
      ...currentState.mapFilter,
      TopLeft: swappedBounds.TopLeft,
      BottomRight: swappedBounds.BottomRight,
      ZoomLevel: mapProps.zoom
    };
  }

  static getMapDetailsFromScope(scope: ExchangeExplorerScopeResponse, isDataCut: boolean = false): any {
    const scopeContext = scope.ScopeContext;
    const mapSummary: ExchangeMapSummary = scopeContext.ExchangeDataSearchResponse.MapSummary;
    const tl = isDataCut ? mapSummary.TopLeft : scopeContext.ScopeTopLeft;
    const br = isDataCut ? mapSummary.BottomRight : scopeContext.ScopeBottomRight;
    const mapCollection: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: scopeContext.ExchangeDataSearchResponse.FeatureCollection
    };
    const boundsForOneMapCopy = [tl.Lon, br.Lat, br.Lon, tl.Lat];
    const lngLatBounds = new LngLatBounds(
      [boundsForOneMapCopy[0], boundsForOneMapCopy[1]],
      [boundsForOneMapCopy[2], boundsForOneMapCopy[3]]
    );
    return {
      MapCollection: mapCollection,
      MapSummary: mapSummary,
      InitialMapBounds: boundsForOneMapCopy,
      Centroid: lngLatBounds.getCenter().toArray(),
      ZoomLevel: scopeContext.ZoomLevel,
      MapFilter: {
        TopLeft: tl,
        BottomRight: br
      }
    };
  }

 public static MapGeoDataHasBounds(mapSummary: MapGeoData): boolean {
    const hasNewTLBounds = !!mapSummary.TopLeft && !!mapSummary.TopLeft.Lat && !!mapSummary.TopLeft.Lon;
    const hasNewBRBounds = !!mapSummary.BottomRight && !!mapSummary.BottomRight.Lat && !!mapSummary.BottomRight.Lon;
    return hasNewTLBounds && hasNewBRBounds;
  }

  static setBounds(mapGeoData: MapGeoData, currentState: any, newState: any): any {
    if (MapHelper.MapGeoDataHasBounds(mapGeoData)) {
      const newTL = mapGeoData.TopLeft;
      const newBR = mapGeoData.BottomRight;
      newState.initialMapBounds = [newTL.Lon, newBR.Lat, newBR.Lon, newTL.Lat];
      newState.mapFilter.TopLeft = newTL;
      newState.mapFilter.BottomRight = newBR;
    }

    //No map bounds, the map view isn't changing so end the autoZoom triggered by clearing map filter bounds
    else {
      newState.autoZooming = false;
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
}
