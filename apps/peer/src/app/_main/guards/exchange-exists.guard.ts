import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { Exchange } from 'libs/models/peer';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';
import * as fromExchangeDashboardReducer from '../reducers';


@Injectable()
export class ExchangeExistsGuard implements CanActivate {

  constructor(
    private store: Store<fromExchangeDashboardReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}

  exchangeExists(exchangeId: number): Observable<boolean> {
    this.store.dispatch(new fromExchangeDashboardActions.LoadingExchange(exchangeId));

    return this.exchangeApiService
      .getExchange(exchangeId)
      .map((exchange: Exchange) => new fromExchangeDashboardActions.LoadingExchangeSuccess(exchange))
      .do((action: fromExchangeDashboardActions.LoadingExchangeSuccess) => this.store.dispatch(action))
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
