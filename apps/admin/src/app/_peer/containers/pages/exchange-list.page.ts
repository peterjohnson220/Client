import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeListItem, UpsertExchangeRequest } from 'libs/models/peer';
import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent implements OnInit {
  exchangeListLoading$: Observable<boolean>;
  exchangeListLoadingError$: Observable<boolean>;
  exchangeListItems$: Observable<ExchangeListItem[]>;
  creatingExchange$: Observable<boolean>;
  creatingExchangeError$: Observable<boolean>;
  creatingExchangeErrorMessage$: Observable<string>;
  createExchangeModalOpen$: Observable<boolean>;

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.exchangeListLoading$ = this.store.select(fromPeerAdminReducer.getExchangeListLoading);
    this.exchangeListLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeListLoadingError);
    this.exchangeListItems$ = this.store.select(fromPeerAdminReducer.getExchangeListItems);
    this.creatingExchange$ = this.store.select(fromPeerAdminReducer.getExchangeListUpserting);
    this.creatingExchangeError$ = this.store.select(fromPeerAdminReducer.getExchangeListUpsertingError);
    this.creatingExchangeErrorMessage$ = this.store.select(fromPeerAdminReducer.getExchangeListUpsertingErrorMessage);
    this.createExchangeModalOpen$ = this.store.select(fromPeerAdminReducer.getExchangeListCreateExchangeModalOpen);
  }

  openCreateExchangeModal() {
    this.store.dispatch(new fromExchangeListActions.OpenCreateExchangeModal);
  }

  // Events
  handleExchangeGridReload() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }

  handleCreateExchange(newExchange: UpsertExchangeRequest) {
    this.store.dispatch(new fromExchangeListActions.UpsertingExchange(newExchange));
  }

  handleCreateExchangeModalDismissed() {
    this.store.dispatch(new fromExchangeListActions.CloseCreateExchangeModal);
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }
}
