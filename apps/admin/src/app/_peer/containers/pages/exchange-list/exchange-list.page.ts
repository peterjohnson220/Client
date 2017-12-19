import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromExchangeListActions from 'libs/shared/peer/actions/exchange-list.actions';
import * as fromSharedPeerReducer from 'libs/shared/peer/reducers';

@Component({
  selector: 'pf-exchange-list-page',
  templateUrl: './exchange-list.page.html',
  styleUrls: ['./exchange-list.page.scss']
})
export class ExchangeListPageComponent {

  constructor(private store: Store<fromSharedPeerReducer.State>) { }

  openCreateExchangeModal() {
    this.store.dispatch(new fromExchangeListActions.OpenCreateExchangeModal);
  }
}
