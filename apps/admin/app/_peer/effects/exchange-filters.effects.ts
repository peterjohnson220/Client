import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromExchangeFiltersActions from '../actions/exchange-filters.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class ExchangeFiltersEffects {

  @Effect()
  loadExchangeFilters$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeFiltersActions.LOAD_EXCHANGE_FILTERS),
      map((action: fromExchangeFiltersActions.LoadExchangeFilters) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.getExchangeFilters(payload.exchangeId, payload.searchString).pipe(
          map((exchangeFiltersResult: GridDataResult) => {
            return new fromExchangeFiltersActions.LoadExchangeFiltersSuccess(exchangeFiltersResult);
          }),
          catchError(error => of(new fromExchangeFiltersActions.LoadExchangeFilterError()))
        );
      }
    )
  );

  @Effect()
  putFilter$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeFiltersActions.PUT_FILTER),
      map((action: fromExchangeFiltersActions.PutFilter) => action.payload),
      withLatestFrom(
        this.peerAdminStore.pipe(select(fromPeerAdminReducer.getExchangeFilters)),
        (action, exchangeFilters) => {
          return {action, exchangeFilters};
        }
      ),
      switchMap(payload => {
        const updateFilter = payload.exchangeFilters.filter(f => f.Id === payload.action.Id);
        return this.exchangeApiService.putFilter(updateFilter[0]).pipe(
          map(() => {
            return new fromExchangeFiltersActions.PutFilterSuccess();
          }),
          catchError(error => of(new fromExchangeFiltersActions.PutFilterError()))
        );
      }
    )
  );

  @Effect()
  reorderFilters$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeFiltersActions.REORDER_FILTERS),
      map((action: fromExchangeFiltersActions.ReorderFilters) => action.payload),
      withLatestFrom(
        this.peerAdminStore.pipe(select(fromPeerAdminReducer.getExchangeFilters)),
        (action, exchangeFilters) => {
          return {action, exchangeFilters};
        }
      ),
      switchMap(payload => {
        return this.exchangeApiService.putFilters(payload.exchangeFilters).pipe(
          map(() => {
            return new fromExchangeFiltersActions.ReorderFiltersSuccess();
          }),
          catchError(error => of(new fromExchangeFiltersActions.ReorderFiltersError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private peerAdminStore: Store<fromPeerAdminReducer.State>
  ) {}
}
