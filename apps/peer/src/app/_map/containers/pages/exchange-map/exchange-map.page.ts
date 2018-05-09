import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange } from 'libs/models';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';

import * as fromSharedPeerReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-exchange-map-page',
  templateUrl: './exchange-map.page.html',
  styleUrls: ['./exchange-map.page.scss']
})
export class ExchangeMapPageComponent implements OnInit, OnDestroy {
  exchangeId: number;
  exchange$: Observable<Exchange>;
  initialMapMoveComplete$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private peerMapStore: Store<fromPeerMapReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.initialMapMoveComplete$ = this.peerMapStore.select(fromPeerMapReducer.getPeerMapInitialMapMoveComplete);
    this.peerMapLoadingError$ = this.peerMapStore.select(fromPeerMapReducer.getPeerMapLoadingError);
    this.exchangeId = +this.route.snapshot.params.id;
  }

  ngOnDestroy() {
    this.peerMapStore.dispatch(new fromPeerMapActions.ResetState());
    this.peerMapStore.dispatch(new fromFilterSidebarActions.ResetState());
  }

  ngOnInit() {
    this.peerMapStore.dispatch(new fromFilterSidebarActions.LimitToExchange(this.exchangeId));
    this.peerMapStore.dispatch(new fromPeerMapActions.LoadPeerMapData());
  }
}
