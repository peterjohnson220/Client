import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point } from 'geojson';
import 'rxjs/add/operator/take';

import { ExchangeMapFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerDataReducers from '../../reducers';
import * as fromPeerMapActions from '../../actions/map.actions';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {
  @Input() companyJobId: number;
  @Input() companyPayMarketId: number;
  selectedPoint: any = null;
  cursorStyle: string;
  mapStyle = 'mapbox://styles/mapbox/streets-v9';
  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapFilter$: Observable<ExchangeMapFilter>;
  peerMapLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapBounds$: Observable<number[]>;
  canLoadPeerMap$: Observable<boolean>;
  peerMapShowNoData$: Observable<boolean>;
  map: mapboxgl.Map;

  constructor(private store: Store<fromPeerDataReducers.State>) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.peerMapFilter$ = this.store.select(fromPeerDataReducers.getPeerMapFilter);
    this.peerMapLoading$ = this.store.select(fromPeerDataReducers.getPeerMapLoading);
    this.peerMapLoadingError$ = this.store.select(fromPeerDataReducers.getPeerMapLoadingError);
    this.peerMapCollection$ = this.store.select(fromPeerDataReducers.getPeerMapCollection);
    this.peerMapBounds$ = this.store.select(fromPeerDataReducers.getPeerMapBounds);
    this.canLoadPeerMap$ = this.store.select(fromPeerDataReducers.canLoadPeerMap);
    this.peerMapShowNoData$ = this.store.select(fromPeerDataReducers.peerMapShowNoData);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromPeerMapActions.LoadingInitialPeerMapFilter({
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId
    }));
  }

  get center(): any {
    if (!this.map) {
      return [0, 0];
    }
    return this.map.getCenter();
  }

  get pointProperties(): string {
    return JSON.stringify(this.selectedPoint.properties);
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
    if (e.target.mapDirty) {
      this.selectedPoint = null;
      e.target.moveStarted = false;
      this.refreshMap(e);
    }
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
  refreshMap(e: any) {
    if (!e.target._loaded || e.target.moving) {
      return;
    }
    this.canLoadPeerMap$.take(1).subscribe(canload => {
      if (canload) {
        const filterVars = {
          bounds: e.target.getBounds(),
          zoom: e.target.getZoom()
        };

        this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilterBounds(filterVars));
      }
    });
  }
}
