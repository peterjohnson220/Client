import { Component, OnDestroy, OnInit } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FeatureCollection, Point } from 'geojson';
import * as mapboxgl from 'mapbox-gl';
import { LngLatBounds } from 'mapbox-gl';

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
  ignoreNextMoveEnd = true;
  peerMapSummary: ExchangeMapSummary;
  peerInitialMapBounds: number[];
  peerInitialMapZoomLevel: number;
  initialMoveEnd = true;
  isInitialized = false;

  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  dataLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapCentroid$: Observable<number[]>;
  peerMapShowNoData$: Observable<boolean>;
  peerMapHasUntaggedIncumbents$: Observable<boolean>;
  peerMapMaxZoom$: Observable<number>;
  peerInitialMapBounds$: Observable<number[]>;
  peerMapInitialZoomLevel$: Observable<number>;
  peerMapAutoZooming$: Observable<boolean>;
  peerMapInitialZoomComplete$: Observable<boolean>;
  peerMapLoaded$: Observable<boolean>;
  peerMapSummarySub: Subscription;
  peerInitialMapBoundsSub: Subscription;
  peerInitialMapZoomLevelSub: Subscription;

  constructor(private store: Store<fromExchangeExplorerReducer.State>) {
    this.peerMapSummary$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapSummary));
    this.dataLoading$ = this.store.pipe(select(fromSearchReducer.getLoadingResults));
    this.peerMapLoadingError$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapLoadingError));
    this.peerMapCollection$ = this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapCollection));
    this.peerMapShowNoData$ = this.store.pipe(select(fromExchangeExplorerReducer.peerMapShowNoData));
    this.peerMapHasUntaggedIncumbents$ = this.store.pipe(select(fromExchangeExplorerReducer.peerMapHasUntaggedIncumbents));
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
    if (!this.isInitialized && this.map.getCanvas().width < 500) {
      this.isInitialized = !this.isInitialized;
      this.map.resize();
    }
    return this.map.getCenter();
  }

  get pointCompaniesPreview(): string {
    return JSON.parse(this.selectedPoint.properties.Companies).slice(0, 10);
  }

  // Map events
  handleZoomEnd(e: any) {
   if (this.map) {this.map.resize(); }
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
      let bounds;
      let zoom;
      // On the initial move end event we want the data to be loaded with the initial map bounds provided to the
      // map without the padding applied. The bounds provided by 'e' in the event have the padding pre applied.
      // This causes data to be loaded in the buffer when loading existing cuts. [BG]
      if (this.initialMoveEnd && this.peerInitialMapBounds && this.peerInitialMapZoomLevel) {
        bounds = new LngLatBounds(
          [this.peerInitialMapBounds[0], this.peerInitialMapBounds[1]],
          [this.peerInitialMapBounds[2], this.peerInitialMapBounds[3]]
        );
        zoom = this.peerInitialMapZoomLevel;
      } else {
        bounds = e.target.getBounds();
        zoom = e.target.getZoom();
      }
      this.store.dispatch(new fromMapActions.MoveEnd({
        bounds: bounds,
        zoom: zoom
      }));
      this.initialMoveEnd = false;
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
    this.peerInitialMapBoundsSub = this.peerInitialMapBounds$.subscribe(ib => this.peerInitialMapBounds = ib);
    this.peerInitialMapZoomLevelSub = this.peerMapInitialZoomLevel$.subscribe(iz => this.peerInitialMapZoomLevel = iz);
  }

  ngOnDestroy() {
    this.peerMapSummarySub.unsubscribe();
    this.peerInitialMapBoundsSub.unsubscribe();
    this.peerInitialMapZoomLevelSub.unsubscribe();
  }
}
