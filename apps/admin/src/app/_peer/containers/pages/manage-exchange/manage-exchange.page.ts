import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../../reducers';

@Component({
  selector: 'pf-manage-exchange-page',
  templateUrl: './manage-exchange.page.html',
  styleUrls: ['./manage-exchange.page.scss']
})
export class ManageExchangePageComponent {
  exchange$: Observable<Exchange>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.exchange$ = this.store.select(fromPeerAdminReducer.getManageExchange);
  }

}
