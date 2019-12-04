import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FeatureCollection, Point } from 'geojson';
import * as mapboxgl from 'mapbox-gl';

import { ExchangeMapSummary } from 'libs/models/peer';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromMapActions from '../../actions/map.actions';
import * as fromExchangeExplorerReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-explorer-map',
  templateUrl: './exchange-explorer-map.component.html',
  styleUrls: ['./exchange-explorer-map.component.scss']
})
export class ExchangeExplorerMapComponent implements OnInit, OnDestroy {
  selectedPoint: any = null;
  cursorStyle: string;
  satelliteStyleEnabled = false;
  map: mapboxgl.Map;
  ignoreNextMoveEnd = false;
  peerMapSummary: ExchangeMapSummary;

  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  dataLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapCentroid$: Observable<number[]>;
  peerMapShowNoData$: Observable<boolean>;
  peerMapMaxZoom$: Observable<number>;
  peerInitialMapBounds$: Observable<number[]>;
  peerMapInitialZoomLevel$: Observable<number>;
  peerMapAutoZooming$: Observable<boolean>;
  peerMapInitialZoomComplete$: Observable<boolean>;
  peerMapLoaded$: Observable<boolean>;
  peerMapSummarySub: Subscription;

  constructor(private store: Store<fromExchangeExplorerReducer.State>) {
    this.peerMapSummary$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapSummary));
    this.dataLoading$ = this.store.pipe(select(fromSearchReducer.getLoadingResults));
    this.peerMapLoadingError$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapLoadingError));
    this.peerMapCollection$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapCollection));
    this.peerMapShowNoData$ = this.store.pipe(select(fromExchangeExplorerReducer.peerMapShowNoData));
    this.peerMapMaxZoom$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapMaxZoom));
    this.peerInitialMapBounds$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerInitialMapBounds));
    this.peerMapInitialZoomLevel$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapInitialZoomLevel));
    this.peerMapCentroid$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapCentroid));
    this.peerMapAutoZooming$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapAutoZooming));
    this.peerMapInitialZoomComplete$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapInitialZoomComplete));
    this.peerMapLoaded$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapLoaded));
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

  // Map events
  handleZoomEnd(e: any) {
    this.peerMapInitialZoomComplete$.pipe(take(1)).subscribe(iz => {
      if (!iz) {
        this.store.dispatch(new fromMapActions.InitialZoomComplete());
      }
    });

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

  handleResizeEvent() {
    this.ignoreNextMoveEnd = true;
  }

  handleMoveEndEvent(e: any) {
    if (!this.ignoreNextMoveEnd) {
      this.store.dispatch(new fromMapActions.MoveEnd({
        bounds: e.target.getBounds(),
        zoom: e.target.getZoom()
      }));
    }

    this.ignoreNextMoveEnd = false;
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

  ngOnInit(): void {
    this.peerMapSummarySub = this.peerMapSummary$.subscribe(pms => this.peerMapSummary = pms);
  }

  ngOnDestroy() {
    this.peerMapSummarySub.unsubscribe();
  }
}
