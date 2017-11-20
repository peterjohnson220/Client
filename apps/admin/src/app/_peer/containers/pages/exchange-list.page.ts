import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent implements OnInit{
  exchangeListLoading$: Observable<boolean>;

  constructor(private store: Store<fromPeerAdminReducer.State>) {
    this.exchangeListLoading$ = this.store.select(fromPeerAdminReducer.getExchangeListLoading);
  }

  ngOnInit() {
    this.store.dispatch(new fromExchangeListActions.LoadingExchanges());
  }
}



