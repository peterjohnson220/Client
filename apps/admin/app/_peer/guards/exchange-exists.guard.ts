import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, filter, take, switchMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';

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
    this.store.dispatch(new fromManageExchangeActions.LoadExchangeManagementDetails(exchangeId));

    return this.waitForExchangeManagementDetails().pipe(
      switchMap(() =>
        this.store.pipe(
          select(fromExchangeDashboardReducer.getManageExchangeLoadingError),
          map(error => {
            if (!error) {
              return true;
            } else {
              // TODO [BC]: When the route fails would rather it fall through to the wildcard route (**).
              this.router.navigate(['/exchange-not-found']);
              return false;
            }
          })
      )));
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.exchangeExists(route.params.id);
  }

  // This will not emit any values until a attempt to get the user context from the API has completed with either
  // a Success or Error.
  waitForExchangeManagementDetails() {
    return this.store.pipe(
      select(fromExchangeDashboardReducer.getManageExchangeLoading, fromExchangeDashboardReducer.getManageExchange),
      filter((isLoading, exchange) => !isLoading && !!exchange),
      take(1)
    );
  }

}
