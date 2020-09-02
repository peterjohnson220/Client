import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, mergeMap, catchError, concatMap } from 'rxjs/operators';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';

import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';
import * as fromExchangeExplorerActions from '../actions/exchange-explorer.actions';
import * as fromExchangeExplorerMapActions from '../actions/map.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

@Injectable()
export class ExchangeExplorerEffects {
  @Effect()
  loadExchangeExplorerContextInfo$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO),
    map((action: fromExchangeExplorerContextInfoActions.LoadContextInfo) => action.payload),
    switchMap((payload: any) =>
      this.exchangeDataSearchApiService.getExchangeExplorerContextInfo(payload).pipe(
        mergeMap((response) => {
          const actions: any[] = [
            new fromExchangeExplorerContextInfoActions.LoadContextInfoSuccess({
              payMarket: response.PayMarketContext && response.PayMarketContext.PayMarket || null,
              payMarketGeoData: response.PayMarketContext && response.PayMarketContext.PayMarketGeoData || null,
              exchangeJobFilterOptions: response.AssociatedExchangeJobFilterOptions,
              searchFilterMappingDataObj: response.SearchFilterMappingData
            }),
            new fromExchangeExplorerMapActions.SetPeerMapBounds(response.InitialMapGeoData),
            new fromExchangeFilterContextActions.SetFilterContext(response.FilterContext, payload.defaultScopeId)
          ];
          const hasNoInitialMapGeoData = response.InitialMapGeoData.TopLeft.Lat === null ||
            response.InitialMapGeoData.BottomRight.Lat === null;

          // If we don't have any initial map bounds, the map won't move and thus will never call GetResults [JP]
          if (hasNoInitialMapGeoData) {
            actions.push(new fromExchangeSearchResultsActions.GetExchangeDataResults());
          }

          return actions;
        }),
        catchError(() => of(new fromExchangeExplorerContextInfoActions.LoadContextInfoError))
      )
    )
  );

  @Effect()
  refreshPayMarketContext$ = this.actions$.pipe(
    ofType(fromExchangeExplorerContextInfoActions.REFRESH_PAYMARKET_CONTEXT),
    map((action: fromExchangeExplorerContextInfoActions.RefreshPayMarketContext) => action.payload),
    switchMap((payload) =>
      this.exchangeDataSearchApiService.getPayMarketContextInfo(payload).pipe(
        map(response => {
            return new fromExchangeExplorerContextInfoActions.RefreshPayMarketContextSuccess({
              payMarket: response.PayMarket,
              payMarketGeoData: response.PayMarketGeoData
            });
        }),
        catchError(() => of(new fromExchangeExplorerContextInfoActions.RefreshPayMarketContextError))
      )
    )
  );

  @Effect()
  resetExchangeExplorerState$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeExplorerActions.RESET_EXCHANGE_EXPLORER_STATE),
      concatMap(() => {
        return [
          new fromExchangeExplorerMapActions.ResetState(),
          new fromExchangeFilterContextActions.ResetState()
        ];
      })
    );

  @Effect()
  resetInitiallyLoadedExplorerState$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeExplorerActions.RESET_INITIALLY_LOADED_EXCHANGE_EXPLORER_STATE),
      concatMap(() => {
        return [
          new fromExchangeExplorerMapActions.ResetInitiallyLoadedState(),
          new fromExchangeFilterContextActions.ResetInitiallyLoadedState(),
          new fromExchangeExplorerContextInfoActions.ResetInitiallyLoadedState(),
          new fromExchangeScopeActions.ResetInitiallyLoadedState(),
          new fromSearchFiltersActions.ClearFilters()
        ];
      })
    );

  @Effect()
  refineExchangeJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeExplorerActions.REFINE_EXCHANGE_JOB),
      mergeMap((action: fromExchangeExplorerActions.RefineExchangeJob) => {
        const payload = action.payload;
        return [
          new fromExchangeExplorerContextInfoActions.LoadContextInfo(payload),
          new fromExchangeScopeActions.LoadExchangeScopesByJobs({exchangeJobIds: [payload.lockedExchangeJobId]})
        ];
      }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
