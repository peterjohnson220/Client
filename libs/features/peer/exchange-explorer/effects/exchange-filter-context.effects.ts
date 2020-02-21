import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { ExchangeScopeItem } from 'libs/models/peer';
import * as fromLibsFeatureSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromPeerMapActions from '../actions/map.actions';

@Injectable()
export class ExchangeFilterContextEffects {
  @Effect()
  limitToPayMarketToggled$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.TOGGLE_LIMIT_TO_PAYMARKET),
    withLatestFrom(
      this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
      this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextLimitToPayMarket)),
      (
        action: fromExchangeFilterContextActions.ToggleLimitToPayMarket,
        scopeSelection,
        limitToPayMarket
      ) => ({scopeSelection, limitToPayMarket})
    ),
    tap(() => this.store.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
    mergeMap((toggleLimitToPayMarket) => {
      let obs;

      if (toggleLimitToPayMarket.limitToPayMarket) {
        // Only clear selections on paymarket toggle if a scope is not selected
        if (!!toggleLimitToPayMarket.scopeSelection) {
          obs = [
            new fromExchangeSearchResultsActions.GetExchangeDataResults({resetToPayMarketBounds: true})
          ];
        } else {
          obs = [
            new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
            new fromExchangeSearchResultsActions.GetExchangeDataResults({resetToPayMarketBounds: true})
          ];
        }
      } else {
        // Only clear selections on paymarket toggle if a scope is not selected
        if (!!toggleLimitToPayMarket.scopeSelection) {
          obs = [
            new fromExchangeSearchResultsActions.GetExchangeDataResults({resetInitialBounds: true})
          ];
        } else {
          obs = [
            new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
            new fromExchangeSearchResultsActions.GetExchangeDataResults({resetInitialBounds: true})
          ];
        }
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
          new fromExchangeSearchResultsActions.GetExchangeDataResults({ resetInitialBounds: true})
        ];
      } else {
        obs = [
          new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
          new fromExchangeSearchResultsActions.GetExchangeDataResults({ resetInitialBounds: true})
        ];
      }

      return obs;
    })
  );


  @Effect()
  setExchangeJobSelection$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.SET_EXCHANGE_JOB_SELECTION),
    tap(() => this.store.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
    mergeMap(() => {
      return [
        new fromLibsFeatureSearchFiltersActions.ResetAllFilters(),
        new fromExchangeSearchResultsActions.GetExchangeDataResults({ resetInitialBounds: true})
      ];
    })
  );


  @Effect()
  includeUntaggedEmployeesToggled$ = this.actions$.pipe(
    ofType(fromExchangeFilterContextActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES),
    mergeMap(() => [
      new fromExchangeSearchResultsActions.GetExchangeDataResults({getSingledFilteredAggregates: true})
    ])
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>
  ) {}
}
