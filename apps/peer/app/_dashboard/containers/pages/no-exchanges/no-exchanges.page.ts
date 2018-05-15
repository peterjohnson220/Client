import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';

@Component({
  selector: 'pf-no-exchanges-page',
  templateUrl: './no-exchanges.page.html',
  styleUrls: ['./no-exchanges.page.scss']
})
export class NoExchangesPageComponent {
  constructor(
    private store: Store<fromPeerDashboardReducer.State>
  ) {}

  openRequestAccessModal(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access));
  }
}
