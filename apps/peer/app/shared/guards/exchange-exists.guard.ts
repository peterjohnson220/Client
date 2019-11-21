import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { Exchange } from 'libs/models/peer';

import * as fromExchangeActions from '../../shared/actions/exchange.actions';
import * as sharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeExistsGuard implements CanActivate, CanActivateChild {

  constructor(
    private store: Store<sharedPeerReducer.State>,
    private exchangeApiService: ExchangeApiService,
    private router: Router
  ) {}

  exchangeExists(exchangeId: number, path: string): Observable<boolean> {
    this.store.dispatch(new fromExchangeActions.LoadExchange(exchangeId));

    return this.exchangeApiService.getExchange(exchangeId).pipe(
      map((exchange: Exchange) => {
        if (!!exchange) {
          return new fromExchangeActions.LoadExchangeSuccess({ exchange, path });
        } else {
          this.exchangeNotFound();
        }
      }),
      tap((action: fromExchangeActions.LoadExchangeSuccess) => this.store.dispatch(action)),
      map(() => true),
      catchError(() => this.exchangeNotFound())
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.exchangeExists(route.params.id, route.routeConfig.path);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.exchangeExists(childRoute.parent.params.id, childRoute.routeConfig.path);
  }

  private exchangeNotFound(): Observable<boolean> {
    this.router.navigate(['/exchange-not-found']);
    return of(false);
  }
}
