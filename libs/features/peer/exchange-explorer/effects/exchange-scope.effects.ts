import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom, concatMap, mergeMap, filter } from 'rxjs/operators';

import { ExchangeScopeApiService, ExchangeDataFilterApiService } from 'libs/data/payfactors-api/peer';
import {
  ExchangeExplorerContextInfo,
  ExchangeScopeItem,
  UpsertExchangeExplorerScopeRequest
} from 'libs/models/peer';
import {
  ExchangeExplorerDataCutResponse,
  ExchangeExplorerScopeResponse,
  ExchangeExplorerScopeResponseContext
} from 'libs/models/payfactors-api/peer/exchange-data-filter/response';
import { Filter } from 'libs/features/search/search/models';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/search/helpers';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { SettingsService } from 'libs/state/app-context/services';
import { DataCutSummaryEntityTypes } from 'libs/constants';
import { InfiniteScrollActionContext, InfiniteScrollEffectsService } from 'libs/features/search/infinite-scroll/services';
import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import { ExchangeScopesByExchangeRequest } from 'libs/models/payfactors-api/peer/exchange-scopes/request';
import { ExchangeScopesByJobsRequest } from 'libs/models/payfactors-api/peer/exchange-scopes/request/exchange-scopes-by-jobs-request';

import { ExchangeExplorerContextService } from '../services';
import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';
import * as fromExchangeFilterContextActions from '../actions/exchange-filter-context.actions';
import * as fromMapActions from '../actions/map.actions';
import * as fromExchangeDataCutActions from '../actions/exchange-data-cut.actions';
import * as fromExchangeExplorerReducers from '../reducers';
import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';
import * as fromExchangeExplorerMapActions from '../actions/map.actions';

@Injectable()
export class ExchangeScopeEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducers.State>,
    private exchangeScopeApiService: ExchangeScopeApiService,
    private exchangeDataFilterApiService: ExchangeDataFilterApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private settingsService: SettingsService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService
  ) {}

  @Effect()
  loadExchangeScopesByJobs: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS)).pipe(
      map(() => new fromInfiniteScrollActions.Load( { scrollId: ScrollIdConstants.EXCHANGE_SCOPES, pageSize: 10}))
  );

  @Effect()
  loadExchangeScopesByExchange: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE)).pipe(
      map(() => new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.EXCHANGE_SCOPES, pageSize: 10}))
  );

  @Effect()
  infiniteScrollExchangeScopes$ = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.EXCHANGE_SCOPES)
    .pipe(
      withLatestFrom(
          this.store.pipe(select(fromExchangeExplorerReducers.getExchangeId)),
          this.store.pipe(select(fromExchangeExplorerReducers.getIncludeCompanyScopes)),
          this.store.pipe(select(fromExchangeExplorerReducers.getIncludeStandardScopes)),
          this.store.pipe(select(fromExchangeExplorerReducers.getExchangeScopes)),
          this.store.pipe(select(fromExchangeExplorerReducers.getAssociatedExchangeJobIds)),
          this.store.pipe(select(fromExchangeExplorerReducers.getExchangeScopeNameFilter)),
          this.settingsService.selectUiPersistenceSettingDictionary<string>(FeatureAreaConstants.PeerManageScopes,
            UiPersistenceSettingConstants.PeerDefaultExchangeScopes),
        (action, exchangeId, includeCompanyScopes, includeStandardScopes, currentScopes, exchangeJobs, scopeNameFilter, defaultScopeDictionary) =>
          ({action, exchangeId, includeCompanyScopes, includeStandardScopes, currentScopes, exchangeJobs, scopeNameFilter, defaultScopeDictionary})
      ),
      switchMap(data => {

        const defaultScopeId = +data.defaultScopeDictionary[data.exchangeId];

        if (data.exchangeJobs?.length > 0) {

          const jobScopeRequest: ExchangeScopesByJobsRequest = {
            ExchangeJobIds: data.exchangeJobs,
            PagingOptions: data.action.pagingOptions,
            ScopeNameFilter: data.scopeNameFilter
          };

          return this.exchangeScopeApiService.getExchangeScopesByJobs(jobScopeRequest).pipe(
            mergeMap((response) => {
              const actions = [];
              data.action.scrollSuccessful(this.store, response);
              const combinedScopes = data.currentScopes.concat(response);
              actions.push( new fromExchangeScopeActions.SetExchangeScopes(combinedScopes));
              actions.push(new fromExchangeScopeActions.LoadExchangeScopesByJobsSuccess);

              return actions;
            })
          );
        }

        const exchangeScopeRequest: ExchangeScopesByExchangeRequest = {
          ExchangeId: data.exchangeId,
          IncludeCompanyScopes: data.includeCompanyScopes,
          IncludeStandardScopes: data.includeStandardScopes,
          PagingOptions: data.action.pagingOptions,
          ScopeNameFilter: data.scopeNameFilter,
          DefaultScopeId: defaultScopeId
        };

        return this.exchangeScopeApiService.getExchangeScopesByExchange(exchangeScopeRequest).pipe(
          mergeMap( (response) => {

            const actions = [];

            data.action.scrollSuccessful(this.store, response);

            const combinedScopes = data.currentScopes.concat(response);
            actions.push(new fromExchangeScopeActions.SetExchangeScopes(combinedScopes));
            actions.push(new fromExchangeScopeActions.LoadExchangeScopesByExchangeSuccess);
            return actions;
          })
        );
      })
    );

  @Effect()
  loadExchangeDataCut: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT)).pipe(
    map((action: fromExchangeDataCutActions.LoadExchangeDataCut) => action.payload),
    switchMap(payload =>
      this.exchangeDataFilterApiService.getExchangeDataCutFilterContext(payload).pipe(
        mergeMap((response: ExchangeExplorerDataCutResponse) => ExchangeScopeEffects.getExchangeExplorerDataCutResponseActions(response)),
        catchError(() => of(new fromExchangeDataCutActions.LoadExchangeDataCutError))
      )
    )
  );

  @Effect()
  loadTempExchangeDataCut: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeDataCutActions.LOAD_TEMP_EXCHANGE_DATA_CUT),
    map((action: fromExchangeDataCutActions.LoadTempExchangeDataCut) => action.payload),
    filter((payload: any) => !payload.MatchType),
    switchMap((payload: any) =>
      this.exchangeDataFilterApiService.getTempExchangeDataCutFilterContext(payload).pipe(
        mergeMap((response: ExchangeExplorerDataCutResponse) => ExchangeScopeEffects.getExchangeExplorerDataCutResponseActions(response)),
        catchError((error) => of(new fromExchangeDataCutActions.LoadExchangeDataCutError))
      )
    )
  );

  @Effect()
  loadTempExchangeDataCutFromEntity: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeDataCutActions.LOAD_TEMP_EXCHANGE_DATA_CUT),
    map((action: fromExchangeDataCutActions.LoadTempExchangeDataCut) => action.payload),
    filter((payload: any) => !!payload.MatchType && payload.MatchType !== DataCutSummaryEntityTypes.CustomPeerCutId),
    switchMap((payload: any) =>
      this.exchangeDataFilterApiService.getTempExchangeDataCutFilterContextFromEntity(payload).pipe(
        mergeMap((response: ExchangeExplorerDataCutResponse) => ExchangeScopeEffects.getExchangeExplorerDataCutResponseActions(response)),
        catchError((error) => of(new fromExchangeDataCutActions.LoadExchangeDataCutError))
      )
    )
  );

  @Effect()
  loadExchangeScopeDetails: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS)).pipe(
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        this.store.pipe(select(fromExchangeExplorerReducers.getSelectedExchangeScope)),
        (action, filterContext, selectedExchangeScope) => ({filterContext, selectedExchangeScope})),
      switchMap(payload =>
        this.exchangeDataFilterApiService.getExchangeScopeFilterContext(payload.filterContext, payload.selectedExchangeScope.IsStandardScope).pipe(
          mergeMap((peerMapScopeDetails: ExchangeExplorerScopeResponse) => {
            return [
              new fromExchangeFilterContextActions.SetFilterContext(peerMapScopeDetails.FilterContext),
              new fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess(peerMapScopeDetails)
            ];
          }),
          catchError(() => of(new fromExchangeScopeActions.LoadExchangeScopeDetailsError))
        )
      )
    );

  @Effect()
  loadExchangeScopeDetailsSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS, fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT_SUCCESS)).pipe(
      withLatestFrom(
        this.store.pipe(select(fromSearchReducer.getSearchingFilter)),
        this.store.pipe(select(fromSearchReducer.getSingledFilter)),
        this.store.pipe(select(fromExchangeExplorerReducers.getSearchFilterMappingDataObj)),
        (
          action: fromExchangeScopeActions.LoadExchangeScopeDetailsSuccess|fromExchangeDataCutActions.LoadExchangeDataCutSuccess,
          searchingFilter,
          singledFilter,
          searchFilterMappingDataObj
        ) => ({
          response: (action.payload),
          searchingFilter,
          singledFilter,
          searchFilterMappingDataObj,
          isDataCut: action.type === fromExchangeDataCutActions.LOAD_EXCHANGE_DATA_CUT_SUCCESS
        })
      ),
      mergeMap((payload: any) => {
        const actions = [];

        const scopeResponse: ExchangeExplorerScopeResponse = payload.response;
        const scopeContext: ExchangeExplorerScopeResponseContext = scopeResponse.ScopeContext;
        const searchResponse = scopeContext.ExchangeDataSearchResponse;
        const filters: Filter[] = this.payfactorsSearchApiModelMapper.mapSearchFiltersToFilters(
          searchResponse.SearchFilters,
          payload.searchFilterMappingDataObj
        ) as Filter[];

        const savedFilters = this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(
          [scopeContext.SelectedFilterOptions],
          payload.searchFilterMappingDataObj
        );
        const selections = savedFilters[0].Filters;
        actions.push(new fromSearchFiltersActions.ApplySavedFilters(selections));

        actions.push(new fromSearchFiltersActions.RefreshFilters({
          filters: filters,
          keepFilteredOutOptions: false
        }));
        actions.push(new fromSearchResultsActions.GetResultsSuccess({
          totalRecordCount: searchResponse.Paging.TotalRecordCount
        }));

        if (payload.searchingFilter) {
          actions.push(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER}));
        }

        const applyAction = payload.isDataCut ?
          new fromMapActions.ApplyCutCriteria(scopeResponse) :
          new fromMapActions.ApplyScopeCriteria(scopeResponse);
        actions.push(applyAction);

        return actions;
      })
    );

  @Effect()
  applyScopeCriteriaSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromMapActions.APPLY_CUT_CRITERIA, fromMapActions.APPLY_SCOPE_CRITERIA),
    map(() => new fromMapActions.ApplyScopeCriteriaSuccess())
  );

  @Effect()
  upsertExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE),
    map((action: fromExchangeScopeActions.UpsertExchangeScope) => action.payload),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (actionPayload, filterContext) => {
        return {
          ExchangeScopeDetails: actionPayload,
          ExchangeDataSearchRequest: filterContext
        };
      }
    ),
    switchMap((request: UpsertExchangeExplorerScopeRequest) => this.exchangeScopeApiService.upsertExchangeExplorerScope(request).pipe(
      concatMap((exchangeScopeItem: ExchangeScopeItem) => {
        if (!!request.ExchangeScopeDetails.IsDefault) {
          this.settingsService.updateUiPersistenceSettingDictionary(
            FeatureAreaConstants.PeerManageScopes,
            UiPersistenceSettingConstants.PeerDefaultExchangeScopes,
            request.ExchangeScopeDetails.ExchangeId,
            exchangeScopeItem.ExchangeScopeId
          );
        }
        return [
          new fromExchangeScopeActions.UpsertExchangeScopeSuccess(),
          new fromExchangeScopeActions.LoadExchangeScopesByExchange(),
          new fromExchangeFilterContextActions.SetExchangeScopeSelection(exchangeScopeItem)
        ];
      }),
      catchError(() => of(new fromExchangeScopeActions.UpsertExchangeScopeError()))
    ))
  );

  @Effect()
  deleteExchangeScope$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeScopeActions.DELETE_EXCHANGE_SCOPE)).pipe(
      map((action: fromExchangeScopeActions.DeleteExchangeScope) => action.payload),
      withLatestFrom(this.store.pipe(select(fromExchangeExplorerReducers.getFilterContextScopeSelection)),
        (action, selectedScope) => {
          return { action, selectedScope };
        }
      ),
      switchMap(payload =>
        this.exchangeScopeApiService.deleteExchangeScope(payload.action.scopeId, payload.action.isStandardScope).pipe(
          concatMap(() => {
            return [
              new fromExchangeScopeActions.DeleteExchangeScopeSuccess(payload.action.scopeId)
            ];
          }),
          catchError(() => of(new fromExchangeScopeActions.DeleteExchangeScopeError))
        )
      )
    );

  private static getExchangeExplorerDataCutResponseActions(response: ExchangeExplorerDataCutResponse): Action[] {
    const exchangeExplorerContextInfo: ExchangeExplorerContextInfo = response.ExchangeExplorerContextInfo;
    const scopeContext: ExchangeExplorerScopeResponse = { ScopeContext: response.ScopeContext,
      FilterContext: exchangeExplorerContextInfo.FilterContext};
    return [
      new fromExchangeExplorerContextInfoActions.LoadContextInfoSuccess({
        payMarket: exchangeExplorerContextInfo.PayMarketContext?.PayMarket,
        payMarketGeoData: exchangeExplorerContextInfo.PayMarketContext?.PayMarketGeoData,
        exchangeJobFilterOptions: exchangeExplorerContextInfo.AssociatedExchangeJobFilterOptions,
        searchFilterMappingDataObj: exchangeExplorerContextInfo.SearchFilterMappingData
      }),
      new fromExchangeExplorerMapActions.SetPeerMapBounds(exchangeExplorerContextInfo.FilterContext),
      new fromExchangeFilterContextActions.SetFilterContext(exchangeExplorerContextInfo.FilterContext),
      new fromExchangeDataCutActions.LoadExchangeDataCutSuccess(scopeContext)
    ];
  }
}
