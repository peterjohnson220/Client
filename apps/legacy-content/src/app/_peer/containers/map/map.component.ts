import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point } from 'geojson';
import 'rxjs/add/operator/take';

import { ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerMapActions from '../../actions/map.actions';
import * as fromPeerDataReducers from '../../reducers';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent {
  selectedPoint: any = null;
  cursorStyle: string;
  mapStyle = 'mapbox://styles/mapbox/streets-v9';
  map: mapboxgl.Map;

  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapFilter$: Observable<any>;
  peerMapLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapBounds$: Observable<number[]>;
  canLoadPeerMap$: Observable<boolean>;
  peerMapShowNoData$: Observable<boolean>;
  peerMapMaxZoom$: Observable<number>;
  peerMapInitialMapMoveComplete$: Observable<boolean>;

  constructor(private store: Store<fromPeerDataReducers.State>) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.peerMapFilter$ = this.store.select(fromPeerDataReducers.getPeerMapFilter);
    this.peerMapLoading$ = this.store.select(fromPeerDataReducers.getPeerMapLoading);
    this.peerMapLoadingError$ = this.store.select(fromPeerDataReducers.getPeerMapLoadingError);
    this.peerMapCollection$ = this.store.select(fromPeerDataReducers.getPeerMapCollection);
    this.peerMapBounds$ = this.store.select(fromPeerDataReducers.getPeerMapBounds);
    this.canLoadPeerMap$ = this.store.select(fromPeerDataReducers.canLoadPeerMap);
    this.peerMapShowNoData$ = this.store.select(fromPeerDataReducers.peerMapShowNoData);
    this.peerMapMaxZoom$ = this.store.select(fromPeerDataReducers.getPeerMapMaxZoom);
    this.peerMapInitialMapMoveComplete$ = this.store.select(fromPeerDataReducers.getPeerMapInitialMapMoveComplete);
  }

  get center(): any {
    if (!this.map) {
      return [0, 0];
    }
    return this.map.getCenter();
  }

  get pointCompanies(): string {
    return JSON.parse(this.selectedPoint.properties.Companies);
  }

  // Map events
  handleLoadEvent(e: mapboxgl.Map) {
    this.map = e;
  }

  handleMoveStartEvent(e: any) {
    e.target.moveStarted = true;
  }

  handleMoveEvent(e: any) {
    if (e.target.moveStarted) {
      e.target.mapDirty = e.target._placementDirty;
    }
  }

  handleMoveEndEvent(e: any) {
    const filterVars = {
      bounds: e.target.getBounds(),
      zoom: e.target.getZoom()
    };

    this.peerMapInitialMapMoveComplete$.take(1).subscribe(initialMapMoveComplete => {
      if (!initialMapMoveComplete) {
        this.store.dispatch(new fromPeerMapActions.InitialMapMoveComplete(filterVars));
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

  // Helper functions
  refreshMap(filterVars: any) {
    this.canLoadPeerMap$.take(1).subscribe(canload => {
      if (canload) {
        this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilterBounds(filterVars));
      }
    });
  }
}
