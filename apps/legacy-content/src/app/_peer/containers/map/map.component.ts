import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { FeatureCollection, Point } from 'geojson';
import { ɵa } from 'ngx-mapbox-gl/';

import { ExchangeMapFilter, ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerDataReducers from '../../reducers';
import * as fromPeerMapActions from '../../actions/peer-map.actions';

@Component({
  selector: 'pf-peer-data-cut-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ]
})
export class MapComponent implements OnInit {
  paymarket = 'Boston';
  mapStyle = 'mapbox://styles/mapbox/light-v9';
  companyJobId: number;
  companyPayMarketId: number;
  peerMapCollection$: Observable<FeatureCollection<Point>>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapFilter$: Observable<ExchangeMapFilter>;
  peerMapLoading$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  peerMapBounds$: Observable<number[]>;
  peerMapBounds: number[];

  @ViewChild('mgl-map') map: ɵa;

  constructor(private store: Store<fromPeerDataReducers.State>, private route: ActivatedRoute) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.peerMapFilter$ = this.store.select(fromPeerDataReducers.getPeerMapFilter);
    this.peerMapLoading$ = this.store.select(fromPeerDataReducers.getPeerMapLoading);
    this.peerMapLoadingError$ = this.store.select(fromPeerDataReducers.getPeerMapLoadingError);
    this.peerMapCollection$ = this.store.select(fromPeerDataReducers.getPeerMapCollection);
    this.peerMapBounds$ = this.store.select(fromPeerDataReducers.getPeerMapBounds);
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
    this.peerMapBounds$.subscribe(bounds => {
      if (!!bounds || bounds.length === 0) {
        return;
      }

      const castBounds: any = bounds;
      const eventData: any = { ignoreMoveEvent: true};
      this.map.mapInstance.fitBounds(castBounds, {}, eventData);
    });
    // this.peerMapData$.subscribe(x => {
    //   this.markers.next(new FeatureCollection(x.map(m => {
    //     const coords = [m.Location.Lon, m.Location.Lat];
    //     const incumbentCount = m.Stats.SalaryCount;
    //     const desc = JSON.stringify(m.Stats)
    //     return new GeoJson(coords, incumbentCount, {message: incumbentCount, id: m.Id, description: desc});
    //   })));
    // });
  }

  loadMap(): void {
    this.store.dispatch(new fromPeerMapActions.LoadingPeerMap);
  }

  handleMoveEndEvent(e: any) {
    if (!!e.ignoreMoveEvent) {
      return;
    }

    //TODO: Make this work better.
    console.log('moveEnd: ', e);
    const bounds = e.target.getBounds();
    console.log('moveEnd: ', bounds);

    this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilterBounds(bounds));
    this.loadMap();
  }


}
