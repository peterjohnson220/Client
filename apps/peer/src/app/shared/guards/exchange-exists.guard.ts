import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { Exchange } from 'libs/models/peer';

import * as fromExchangeActions from '../../shared/actions/exchange.actions';
import * as sharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeExistsGuard implements CanActivate {

  constructor(
    private store: Store<sharedPeerReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}

  exchangeExists(exchangeId: number): Observable<boolean> {
    this.store.dispatch(new fromExchangeActions.LoadExchange(exchangeId));

    return this.exchangeApiService
      .getExchange(exchangeId)
      .map((exchange: Exchange) => new fromExchangeActions.LoadExchangeSuccess(exchange))
      .do((action: fromExchangeActions.LoadExchangeSuccess) => this.store.dispatch(action))
      .map(() => true)
      .catch(() => {
        this.router.navigate(['/exchange-not-found']);
        return of(false);
      });
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.exchangeExists(route.params.id);
  }

}
