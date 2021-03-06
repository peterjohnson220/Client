import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppConstants } from 'libs/constants';

import * as fromExchangeListActions from '../../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  get SiteAdminUrl() { return AppConstants.SiteAdminUrl; }

  searchQuery = '';

  constructor(private store: Store<fromPeerAdminReducer.State>, private router: Router) { }

  openCreateExchangeModal() {
    this.store.dispatch(new fromExchangeListActions.OpenCreateExchangeModal);
  }

  // Events
  handleCellClick(exchangeId: number): void {
    this.router.navigate(['peer/exchange', exchangeId]);
  }

  handleSearchChanged(query: string): void {

    if (query && (query.length > 1)) {
      this.searchQuery = query;
    } else {
      this.searchQuery = '';
    }

    this.store.dispatch(new fromExchangeListActions.LoadExchanges(this.searchQuery));
  }
}
