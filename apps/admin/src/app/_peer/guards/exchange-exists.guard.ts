import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { Exchange } from 'libs/models/peer';

import * as fromManageExchangeActions from '../actions/manage-exchange.actions';
import * as fromPeerAdminReducer from '../reducers';


@Injectable()
export class ExchangeExistsGuard implements CanActivate {

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}

  exchangeExists(exchangeId: number): Observable<boolean> {
    this.store.dispatch(new fromManageExchangeActions.LoadingExchange());

    return this.exchangeApiService
      .getExchange(exchangeId)
      .map((exchange: Exchange) => new fromManageExchangeActions.LoadingExchangeSuccess(exchange))
      .do((action: fromManageExchangeActions.LoadingExchangeSuccess) => this.store.dispatch(action))
      .map(() => true)
      .catch(() => {
        // TODO [BC]: When the route fails would rather it fall through to the wildcard route (**).
        this.router.navigate(['/exchange-not-found']);
        return of(false);
      });
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.exchangeExists(route.params.id);
  }

}
