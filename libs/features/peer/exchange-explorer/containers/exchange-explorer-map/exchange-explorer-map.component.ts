import { Component, Input, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { FeatureCollection, Point } from 'geojson';
import * as mapboxgl from 'mapbox-gl';

import { ExchangeMapSummary } from 'libs/models/peer';

import * as fromMapActions from '../../actions/map.actions';
import * as fromExchangeExplorerReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-explorer-map',
  templateUrl: './exchange-explorer-map.component.html',
  styleUrls: ['./exchange-explorer-map.component.scss']
})
export class ExchangeExplorerMapComponent implements OnInit {
  // Conditionally allow the exchange-explorer-map to fit to the provided bounds.
  @Input() canFitBounds: boolean;

  selectedPoint: any = null;
  cursorStyle: string;
  satelliteStyleEnabled = false;
  map: mapboxgl.Map;

  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapFilter$: Observable<any>;
  peerMapLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapBounds$: Observable<number[]>;
  peerMapCentroid$: Observable<number[]>;
  canLoadPeerMap$: Observable<boolean>;
  peerMapShowNoData$: Observable<boolean>;
  peerMapMaxZoom$: Observable<number>;
  peerMapInitialMapMoveComplete$: Observable<boolean>;
  peerMapInitialZoomLevel$: Observable<number>;
  peerMapApplyingScope$: Observable<boolean>;
  peerMapAutoZooming$: Observable<boolean>;

  constructor(private store: Store<fromExchangeExplorerReducer.State>) {
    this.peerMapSummary$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapSummary));
    this.peerMapFilter$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapFilter));
    this.peerMapLoading$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapLoading));
    this.peerMapLoadingError$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapLoadingError));
    this.peerMapCollection$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapCollection));
    this.peerMapBounds$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapBounds));
    this.canLoadPeerMap$ = this.store.pipe(select(fromExchangeExplorerReducer.canLoadPeerMap));
    this.peerMapShowNoData$ = this.store.pipe(select(fromExchangeExplorerReducer.peerMapShowNoData));
    this.peerMapMaxZoom$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapMaxZoom));
    this.peerMapInitialMapMoveComplete$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapInitialMapMoveComplete));
    this.peerMapInitialZoomLevel$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapInitialZoomLevel));
    this.peerMapCentroid$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapCentroid));
    this.peerMapApplyingScope$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapApplyingScope));
    this.peerMapAutoZooming$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapAutoZooming));
  }

  get satelliteStyleEnabledText(): string {
    const styleText = this.satelliteStyleEnabled ? 'Map' : 'Satellite';
    return `Toggle ${styleText} View`;
  }

  get mapStyle(): string {
    const style = this.satelliteStyleEnabled ? 'satellite' : 'streets';
    return `mapbox://styles/mapbox/${style}-v9`;
  }

  get center(): any {
    if (!this.map) {
      return [0, 0];
    }
    return this.map.getCenter();
  }

  get pointCompaniesPreview(): string {
    return JSON.parse(this.selectedPoint.properties.Companies).slice(0, 10);
  }

  getZoomLevel(): number {
    return this.map.getZoom();
  }

  // Map events
  handleZoomEnd(e: any) {
    this.peerMapAutoZooming$.pipe(take(1)).subscribe(az => {
      if (!!az) {
        this.store.dispatch(new fromMapActions.AutoZoomComplete);
      }
    });
  }

  handleLoadEvent(e: mapboxgl.Map) {
    this.map = e;
    this.store.dispatch(new fromMapActions.MapLoaded());
  }

  handleMoveEndEvent(e: any) {
    if (!!e.skipMapRefresh) {
      return;
    }
    let scopeApplied = false;
    this.peerMapApplyingScope$.pipe(take(1)).subscribe(as => {
      if (!!as) {
        this.peerMapBounds$.pipe(take(1)).subscribe(b => {
          this.map.fitBounds([[b[0], b[1]], [b[2], b[3]]], {padding: 50}, {skipMapRefresh: true} as any);
        });
        this.store.dispatch(new fromMapActions.ApplyScopeCriteriaSuccess);
        scopeApplied = true;
      }
    });
    if (scopeApplied) {
      return;
    }

    const filterVars = {
      bounds: e.target.getBounds(),
      zoom: e.target.getZoom()
    };

    this.peerMapInitialMapMoveComplete$.pipe(take(1)).subscribe(initialMapMoveComplete => {
      if (!initialMapMoveComplete) {
        this.store.dispatch(new fromMapActions.InitialMapMoveComplete(filterVars));
      } else {
        this.refreshMap(filterVars);
      }
    });
  }

  // Map layer events
  handleLayerHoverEvent(e: any) {
    this.selectedPoint = e.features[0];
  }

  handleLayerClusteredClickEvent(e: any) {
    e.target.flyTo({
      center: e.features[0].geometry.coordinates,
      zoom: e.target.getZoom() + 1
    });
  }

  toggleSatelliteStyle() {
    this.satelliteStyleEnabled = !this.satelliteStyleEnabled;
  }

  // Helper functions
  refreshMap(filterVars: any) {
    this.canLoadPeerMap$.pipe(filter(canLoad => !!canLoad), take(1)).subscribe(() => {
      this.store.dispatch(new fromMapActions.UpdatePeerMapFilterBounds(filterVars));
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new fromMapActions.LoadZoomPrecisionDictionary());
  }
}
