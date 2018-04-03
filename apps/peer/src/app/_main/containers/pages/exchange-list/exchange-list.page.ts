import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';
import * as fromPeerMainReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  constructor(
    private store: Store<fromPeerMainReducer.State>,
    private router: Router) {}

  handleCellClick(exchangeId: number): void {
    this.router.navigate([ 'exchange', exchangeId ]);
  }

  openRequestAccessModal(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }

  handleBackButtonClick(): void {
    window.location.href = '/marketdata/home.asp';
  }
}
