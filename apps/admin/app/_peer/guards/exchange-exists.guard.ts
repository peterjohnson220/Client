import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { Exchange } from 'libs/models/peer';

import * as fromManageExchangeActions from '../actions/exchange.actions';
import * as fromExchangeDashboardReducer from '../reducers';

@Injectable()
export class ExchangeExistsGuard implements CanActivate {

  constructor(
    private store: Store<fromExchangeDashboardReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}

  exchangeExists(exchangeId: number): Observable<boolean> {
    this.store.dispatch(new fromManageExchangeActions.LoadExchange(exchangeId));

    return this.exchangeApiService
      .getExchange(exchangeId).pipe(
        map((exchange: Exchange) => new fromManageExchangeActions.LoadExchangeSuccess(exchange)),
        tap((action: fromManageExchangeActions.LoadExchangeSuccess) => this.store.dispatch(action)),
        map(() => true),
        catchError(() => {
          // TODO [BC]: When the route fails would rather it fall through to the wildcard route (**).
          this.router.navigate(['/exchange-not-found']);
          return of(false);
        })
      );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.exchangeExists(route.params.id);
  }

}
