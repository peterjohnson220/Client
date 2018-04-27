import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { ExchangeRequestTypeEnum } from 'libs/models/peer/index';

import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  constructor(
    private store: Store<fromPeerDashboardReducer.State>,
    private router: Router) {}

  handleCellClick(exchangeId: number): void {
    this.router.navigate([ '/exchange', exchangeId ]);
  }

  openRequestAccessModal(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }
}
