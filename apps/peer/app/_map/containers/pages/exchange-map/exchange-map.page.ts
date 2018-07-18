import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models';
import { MapComponent } from 'libs/features/peer/map/containers/map/map.component';
import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';

import * as fromExchangeScopeActions from '../../../actions/exchange-scope.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromPeerMapReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-map-page',
  templateUrl: './exchange-map.page.html',
  styleUrls: ['./exchange-map.page.scss']
})
export class ExchangeMapPageComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) map: MapComponent;

  exchangeId: number;
  exchange$: Observable<Exchange>;
  initialMapMoveComplete$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  numberOfCompanySelections$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private libsPeerMapStore: Store<fromLibsPeerMapReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private peerMapStore: Store<fromPeerMapReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.initialMapMoveComplete$ = this.libsPeerMapStore.select(fromLibsPeerMapReducer.getPeerMapInitialMapMoveComplete);
    this.peerMapLoadingError$ = this.libsPeerMapStore.select(fromLibsPeerMapReducer.getPeerMapLoadingError);
    this.numberOfCompanySelections$ = this.libsPeerMapStore.select(fromLibsPeerMapReducer.getNumberOfCompanySelections);
    this.exchangeId = +this.route.snapshot.params.id;
  }

  handleSaveScopeClick() {
    this.peerMapStore.dispatch(new fromExchangeScopeActions.OpenSaveExchangeScopeModal());
  }

  handleUpsertExchangeScopeEvent(scopeName: string) {
    const zoomLevel = this.map.getZoomLevel();
    this.peerMapStore.dispatch(new fromExchangeScopeActions.UpsertExchangeScope({
      ExchangeScopeName: scopeName,
      ZoomLevel: zoomLevel
    }));
  }

  ngOnDestroy() {
    this.libsPeerMapStore.dispatch(new fromLibsPeerMapActions.ResetState());
    this.libsPeerMapStore.dispatch(new fromLibsFilterSidebarActions.ResetState());
  }

  ngOnInit() {
    this.libsPeerMapStore.dispatch(new fromLibsFilterSidebarActions.LimitToExchange(this.exchangeId));
    this.libsPeerMapStore.dispatch(new fromLibsPeerMapActions.LoadPeerMapData());
  }
}
