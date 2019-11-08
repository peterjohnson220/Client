import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api';

import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';

@Injectable()
export class ExchangeExplorerEffects {
  @Effect()
  loadExchangeExplorerContextInfo$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO),
    map((action: fromExchangeExplorerContextInfoActions.LoadContextInfo) => action.payload),
    switchMap((payload) =>
      this.exchangeDataSearchApiService.getExchangeExplorerContextInfo(payload).pipe(
        mergeMap((response) => {
          return [
            new fromExchangeExplorerContextInfoActions.LoadContextInfoSuccess({
              payMarket: response.PayMarket,
              exchangeJobFilterOptions: response.AssociatedExchangeJobFilterOptions,
              searchFilterMappingDataObj: response.SearchFilterMappingData
            }),
            new fromExchangeFilterContextActions.SetFilterContext(response.FilterContext)
          ];

        }),
        catchError(() => of(new fromExchangeExplorerContextInfoActions.LoadContextInfoError))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
