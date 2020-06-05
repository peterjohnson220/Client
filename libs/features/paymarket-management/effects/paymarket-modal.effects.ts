import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { BuildRequestHelper } from 'libs/core/helpers/build-request.helper';
import { PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromPayMarketModalActions from '../actions/paymarket-modal.actions';
import * as fromPayMarketManagementReducer from '../reducers';


@Injectable()
export class PayMarketModalEffects {

  @Effect()
  loadPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.LOAD_PAY_MARKET),
      switchMap((action: fromPayMarketModalActions.LoadPayMarket) => {
        return this.payMarketApiService.getPayMarketWithMdScope(action.payload.payMarketId)
          .pipe(
            map((response) => new fromPayMarketModalActions.LoadPayMarketSuccess(response)),
            catchError(() => of(new fromPayMarketModalActions.LoadPayMarketError()))
          );
      })
    );

  @Effect()
  getDefaultPayMarket$ = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.LOAD_USER_DEFAULT_PAY_MARKET),
      switchMap((action: fromPayMarketModalActions.LoadUserDefaultPayMarket) => {
        return this.payMarketApiService.getDefaultUserPayMarket()
          .pipe(
            map((response) => new fromPayMarketModalActions.LoadPayMarketSuccess(response)),
            catchError(() => of(new fromPayMarketModalActions.LoadPayMarketError()))
          );
      })
    );

  @Effect()
  addPayMarket = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.ADD_PAY_MARKET),
      withLatestFrom(
        this.store.pipe(select(fromPayMarketManagementReducer.getDefaultScopesToAdd)),
        this.store.pipe(select(fromPayMarketManagementReducer.getSelectedExchanges)),
        (action: fromPayMarketModalActions.AddPayMarket, defaultScopesToAdd, exchangeScopes) =>
          ({ action, defaultScopesToAdd, exchangeScopes })
      ),
      switchMap((data) => {
        const request = BuildRequestHelper.buildAddPayMarketRequest(data.action.payload.PayMarketDto, data.defaultScopesToAdd, data.exchangeScopes.obj);
        return this.payMarketApiService.insert(request)
          .pipe(
            map(() => {
              return new fromPayMarketModalActions.AddPayMarketSuccess();
            }),
            catchError((response: HttpErrorResponse) => of(new fromPayMarketModalActions.AddOrUpdatePayMarketError(response.error.error.message)))
          );
      })
    );

  @Effect()
  updatePayMarket = this.actions$
    .pipe(
      ofType(fromPayMarketModalActions.UPDATE_PAY_MARKET),
      withLatestFrom(
        this.store.pipe(select(fromPayMarketManagementReducer.getDefaultScopesToAdd)),
        this.store.pipe(select(fromPayMarketManagementReducer.getSelectedExchanges)),
        this.store.pipe(select(fromPayMarketManagementReducer.getDefaultScopesToDelete)),
        (action: fromPayMarketModalActions.UpdatePayMarket, defaultScopesToAdd, exchangeScopes, defaultScopesToDelete) =>
          ({ action, defaultScopesToAdd, exchangeScopes, defaultScopesToDelete })
      ),
      switchMap((data) => {
        const request = BuildRequestHelper.buildUpdatePayMarketRequest(
            data.action.payload.PayMarketDto, data.defaultScopesToAdd, data.exchangeScopes.obj, data.defaultScopesToDelete);
        return this.payMarketApiService.update(request.PayMarket.CompanyPayMarketId, request)
          .pipe(
            map(() => {
              return new fromPayMarketModalActions.UpdatePayMarketSuccess();
            }),
            catchError((response) => of(new fromPayMarketModalActions.AddOrUpdatePayMarketError(response.error.error.message)))
          );
      })
    );

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>,
    private actions$: Actions,
    private payMarketApiService: PayMarketApiService
  ) {}
}
