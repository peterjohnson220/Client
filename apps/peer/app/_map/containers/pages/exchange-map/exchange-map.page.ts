import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models';
import { MapComponent } from 'libs/features/peer/map/containers/map/map.component';
import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';

import * as fromExchangeScopeActions from '../../../actions/exchange-scope.actions';
import * as fromExportDataCutsActions from '../../../actions/export-data-cuts.actions';
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
  numberOfSelections$: Observable<number>;
  peerMapCompaniesCount$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private libsPeerMapStore: Store<fromLibsPeerMapReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private peerMapStore: Store<fromPeerMapReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchange));
    this.initialMapMoveComplete$ = this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getPeerMapInitialMapMoveComplete));
    this.peerMapLoadingError$ = this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getPeerMapLoadingError));
    this.numberOfCompanySelections$ = this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getNumberOfCompanySelections));
    this.numberOfSelections$ = this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getPeerFilterSelectionsCount));
    this.peerMapCompaniesCount$ = this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getPeerMapCompaniesCount));
    this.exchangeId = +this.route.snapshot.params.id;
  }

  handleSaveScopeClick() {
    this.peerMapStore.dispatch(new fromExchangeScopeActions.OpenSaveExchangeScopeModal());
  }

  handleUpsertExchangeScopeEvent(scopeItem: any) {
    const zoomLevel = this.map.getZoomLevel();
    this.peerMapStore.dispatch(new fromExchangeScopeActions.UpsertExchangeScope({
      ExchangeScopeName: scopeItem.Name,
      ExchangeScopeDescription: scopeItem.Description,
      ZoomLevel: zoomLevel
    }));
  }

  handleExportDataCutsClick() {
    this.peerMapStore.dispatch(new fromExportDataCutsActions.OpenExportDataCutsModal());
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
