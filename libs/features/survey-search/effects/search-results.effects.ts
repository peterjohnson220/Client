import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/index';

import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { PagingOptions } from 'libs/models/payfactors-api';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import { PayfactorsSearchApiHelper } from 'libs/features/search/helpers';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import { SurveySearchEffectsService } from '../services';
import * as fromSurveySearchReducer from '../reducers';
import { PayfactorsSurveySearchApiModelMapper } from '../helpers';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.surveySearchEffectsService.searchSurveyJobs(
    this.actions$.pipe(ofType(fromSearchResultsActions.GET_RESULTS))
  );

  @Effect()
  getSurveyDataCutResults$ = this.actions$
    .pipe(
      ofType(fromSurveySearchResultsActions.GET_SURVEY_DATA_RESULTS),
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromSurveySearchResultsActions.GetSurveyDataResults, filters, projectSearchContext, selectedDataCuts) =>
          ({ action, filters, projectSearchContext, selectedDataCuts })),
      mergeMap((data) => {
          const surveyJobId = data.action.payload.Id;
          const currencyCode = data.projectSearchContext.CurrencyCode;
          const projectId = data.projectSearchContext.ProjectId;
          const searchFieldsRequestObj = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters);
          const filtersRequestObj = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters);
          const pagingOptions: PagingOptions = {
            From: data.action.payload.DataCuts.length,
            Count: 150
          };
          return this.surveySearchApiService.searchDataCuts({
            SurveyJobId: surveyJobId,
            SearchFields: searchFieldsRequestObj,
            Filters: filtersRequestObj,
            CurrencyCode: currencyCode,
            ProjectId: projectId,
            PagingOptions: pagingOptions
          })
            .pipe(
              map(response => new fromSurveySearchResultsActions.GetSurveyDataResultsSuccess({
                SurveyJobId: surveyJobId,
                DataCuts: PayfactorsSurveySearchApiModelMapper.mapSurveyJobDataResponseToDataCut(response.DataCuts, data.selectedDataCuts),
                TotalResults: response.TotalResults
              })),
              catchError(() => of(new fromSurveySearchResultsActions.GetSurveyDataResultsError(surveyJobId)))
            );
        }
      ));

  @Effect()
  getExchangeDataResults$ = this.actions$
    .pipe(
      ofType(fromSurveySearchResultsActions.GET_EXCHANGE_DATA_RESULTS),
      withLatestFrom(
        this.store.select(fromSearchReducer.getParentFilters),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromSurveySearchResultsActions.GetExchangeDataResults, filters, projectSearchContext, selectedDataCuts) =>
          ({ action, filters, projectSearchContext, selectedDataCuts })),
      mergeMap((data) => {
          const exchangeJobId = data.action.payload.PeerJobInfo.ExchangeJobId;
          const currencyCode = data.projectSearchContext.CurrencyCode;
          const countryCode = data.projectSearchContext.CountryCode;
          const projectId = data.projectSearchContext.ProjectId;
          const searchFieldsRequestObj = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters);
          const filtersRequestObj = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters);

          return this.surveySearchApiService.getExchangeJobData({
            ExchangeJobId: exchangeJobId,
            SearchFields: searchFieldsRequestObj,
            Filters: filtersRequestObj,
            CurrencyCode: currencyCode,
            ProjectId: projectId,
            CountryCode: countryCode
          })
            .pipe(
              map(response => new fromSurveySearchResultsActions.GetExchangeDataResultsSuccess({
                ExchangeJobId: exchangeJobId,
                DataCuts: PayfactorsSurveySearchApiModelMapper
                  .mapExchangeJobDataCutResponseToDataCut(response.DataCuts, data.selectedDataCuts)
              })),
              catchError(() => of(new fromSurveySearchResultsActions.GetExchangeDataResultsError({ exchangeJobId })))
            );
        }
      ));

  @Effect()
  getMoreResults$ = this.surveySearchEffectsService.searchSurveyJobs(
    this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS))
  );

  @Effect()
  replaceJobResults$ = this.surveySearchEffectsService.loadPricingMatches(
    this.actions$.pipe(ofType(fromSurveySearchResultsActions.REPLACE_JOB_RESULTS))
  );

  @Effect()
  getMoreResultsSuccess$ = this.surveySearchEffectsService.loadPricingMatches(
    this.actions$.pipe(ofType(fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromSurveySearchReducer.State>,
    private surveySearchEffectsService: SurveySearchEffectsService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
