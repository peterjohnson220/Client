import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point } from 'geojson';

import { ExchangeMapFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerDataReducers from '../../reducers';
import * as fromPeerMapActions from '../../actions/peer-map.actions';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {
  mapStyle = 'mapbox://styles/mapbox/light-v9';
  companyJobId: number;
  companyPayMarketId: number;
  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapFilter$: Observable<ExchangeMapFilter>;
  peerMapLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapBounds$: Observable<number[]>;

  peerMapCenter$: Observable<number[]>;
  canLoadPeerMap: Observable<boolean>;

  constructor(private store: Store<fromPeerDataReducers.State>, private route: ActivatedRoute) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.peerMapFilter$ = this.store.select(fromPeerDataReducers.getPeerMapFilter);
    this.peerMapLoading$ = this.store.select(fromPeerDataReducers.getPeerMapLoading);
    this.peerMapLoadingError$ = this.store.select(fromPeerDataReducers.getPeerMapLoadingError);
    this.peerMapCollection$ = this.store.select(fromPeerDataReducers.getPeerMapCollection);
    this.peerMapBounds$ = this.store.select(fromPeerDataReducers.getPeerMapBounds);
    this.peerMapCenter$ = this.store.select(fromPeerDataReducers.getPeerMapCenter);
    this.canLoadPeerMap = this.store.select(fromPeerDataReducers.canLoadPeerMap);
  }

  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    const companyJobId = +queryParamMap.get('companyJobId') || 0;
    const companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    console.log('companyJobId: ', companyJobId);
    console.log('companyPayMarketId: ', companyPayMarketId);
    this.store.dispatch(new fromPeerMapActions.LoadingInitialPeerMapFilter({
      CompanyJobId: companyJobId,
      CompanyPayMarketId: companyPayMarketId
    }));
  }

  handleMoveEndEvent(e: any) {
    if (!e.target._loaded) {
      return;
    }

    if (!!this.canLoadPeerMap.filter(x => x).take(1)) {
      const filterVars = {
        bounds: e.target.getBounds(),
        zoom: e.target.getZoom()
      };

      this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilterBounds(filterVars));
    }
  }

  handleLayerClickEvent(e: any) {
    console.log('handleLayerClickEvent: ', e);
  }
}
