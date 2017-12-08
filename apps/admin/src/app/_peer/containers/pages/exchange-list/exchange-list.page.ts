import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeListItem } from 'libs/models/peer/exchange-list-item.model';

import * as fromExchangeListActions from '../../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../../reducers/index';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent implements OnInit {
  exchangeListLoading$: Observable<boolean>;
  exchangeListLoadingError$: Observable<boolean>;
  exchangeListItems$: Observable<ExchangeListItem[]>;

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.exchangeListLoading$ = this.store.select(fromPeerAdminReducer.getExchangeListLoading);
    this.exchangeListLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeListLoadingError);
    this.exchangeListItems$ = this.store.select(fromPeerAdminReducer.getExchangeListItems);
  }

  // Events
  handleExchangeGridReload() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }
}
