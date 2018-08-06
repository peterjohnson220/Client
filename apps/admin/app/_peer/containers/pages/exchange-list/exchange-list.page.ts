import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromExchangeListActions from '../../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  constructor(private store: Store<fromPeerAdminReducer.State>, private router: Router) { }

  openCreateExchangeModal() {
    this.store.dispatch(new fromExchangeListActions.OpenCreateExchangeModal);
  }

  // Events
  handleCellClick(exchangeId: number): void {
    this.router.navigate([ 'peer/exchange', exchangeId ]);
  }

  handleBackButtonClick(): void {
    window.location.href = '/ng/site-admin/navigation';
  }
}
