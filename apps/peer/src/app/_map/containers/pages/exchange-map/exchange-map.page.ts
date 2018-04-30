import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Exchange } from 'libs/models';

import * as fromSharedPeerReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-exchange-map-page',
  templateUrl: './exchange-map.page.html',
  styleUrls: ['./exchange-map.page.scss']
})
export class ExchangeMapPageComponent {
  exchangeId: number;
  exchange$: Observable<Exchange>;

  constructor(
    private route: ActivatedRoute,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>
  ) {
    this.exchange$ = this.sharedPeerStore.select(fromSharedPeerReducer.getExchange);
    this.exchangeId = this.route.snapshot.params.id;
  }
}
