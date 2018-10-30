import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { ExchangeScopeApiService } from 'libs/data/payfactors-api';
import { UpsertExchangeScopeRequest } from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import * as fromLibsPeerMapReducers from 'libs/features/peer/map/reducers';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

@Injectable()
export class ExchangeScopeEffects {

  @Effect()
  upsertExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE),
      map((action: fromExchangeScopeActions.UpsertExchangeScope) => action.payload),
      withLatestFrom(this.libsPeerMapStore.pipe(select(
        fromLibsPeerMapReducers.getExchangeDataCutRequestData)),
        (actionPayload, storePayload) => {
          return {
            ...actionPayload,
            Filter: {...storePayload}
          };
        }
      ),
      switchMap((request: UpsertExchangeScopeRequest) => this.exchangeScopeApiService.upsertExchangeScope(request).pipe(
        map(() => {
          return new fromExchangeScopeActions.UpsertExchangeScopeSuccess();
        }),
        catchError(() => of(new fromExchangeScopeActions.UpsertExchangeScopeError()))
      ))
    );

  constructor(
    private actions$: Actions,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private libsPeerMapStore: Store<fromLibsPeerMapReducers.State>
  ) {}
}
