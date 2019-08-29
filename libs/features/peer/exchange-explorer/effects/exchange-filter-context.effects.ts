import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { ExchangeDataSearchApiService, PayMarketApiService } from 'libs/data/payfactors-api';
import { ExchangeScopeItem } from 'libs/models/peer';
import * as fromLibsFeatureSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromPeerMapActions from '../actions/map.actions';

@Injectable()
export class ExchangeFilterContextEffects {
  @Effect()
  getExchangeFilterContext$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.LOAD_SYSTEM_FILTER),
    map((action: fromExchangeFilterContextActions.LoadSystemFilter) => action.payload),
    switchMap((payload) =>
      this.exchangeDataSearchApiService.getSystemFilter(payload).pipe(
        map((response) => new fromExchangeFilterContextActions
          .LoadSystemFilterSuccess(response))
      )
    )
  );

  @Effect()
  loadingSystemFilterSuccess$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.LOAD_SYSTEM_FILTER_SUCCESS),
    map((action: fromExchangeFilterContextActions.LoadSystemFilterSuccess) => action.payload),
    switchMap(() => of(new fromExchangeSearchResultsActions.GetExchangeDataResults))
  );

  @Effect()
  loadPayMarketInformation$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.LOAD_PAYMARKET_INFORMATION),
    map((action: fromExchangeFilterContextActions.LoadPayMarketInformation) => action.payload),
    switchMap((payload) => {
      return this.payMarketApiService.get(payload).pipe(
        map((response) => new fromExchangeFilterContextActions.LoadPayMarketInformationSuccess(response))
      );
    })
  );

  @Effect()
  limitToPayMarketToggled$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.TOGGLE_LIMIT_TO_PAYMARKET),
    withLatestFrom(
      this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
      (action, scopeSelection: ExchangeScopeItem) => !!scopeSelection
    ),
    tap(() => this.store.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
    mergeMap((scopeSelected: boolean) => {
      let obs;
      // Only clear selections on paymarket toggle if a scope is not selected
      if (scopeSelected) {
        obs = [
          new fromExchangeSearchResultsActions.GetExchangeDataResults()
        ];
      } else {
        obs = [
          new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
          new fromExchangeSearchResultsActions.GetExchangeDataResults()
        ];
      }

      return obs;
    })
  );

  @Effect()
  excludeIndirectJobMatchesToggled$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES),
    withLatestFrom(
      this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
      (action, scopeSelection: ExchangeScopeItem) => !!scopeSelection
    ),
    tap(() => this.store.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
    mergeMap((scopeSelected: boolean) => {
      let obs;
      // Only clear selections on paymarket toggle if a scope is not selected
      if (scopeSelected) {
        obs = [
          new fromExchangeSearchResultsActions.GetExchangeDataResults()
        ];
      } else {
        obs = [
          new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
          new fromExchangeSearchResultsActions.GetExchangeDataResults()
        ];
      }

      return obs;
    })
  );

  @Effect()
  includeUntaggedEmployeesToggled$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES),
    mergeMap(() => [
      new fromExchangeSearchResultsActions.GetExchangeDataResults
    ])
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private payMarketApiService: PayMarketApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
