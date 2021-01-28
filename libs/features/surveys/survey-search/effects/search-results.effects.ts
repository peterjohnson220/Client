import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { PagingOptions } from 'libs/models/payfactors-api';
import * as fromSearchReducer from 'libs/features/search/search/reducers';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';
import { PayfactorsSearchApiHelper } from 'libs/features/search/search/helpers';

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
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromSurveySearchResultsActions.GetSurveyDataResults, filters, pricingMatchDataSearchContext, selectedDataCuts) =>
          ({ action, filters, pricingMatchDataSearchContext, selectedDataCuts })),
      mergeMap((data) => {
          const surveyJobId = data.action.payload.Id;
          const currencyCode = data.pricingMatchDataSearchContext.CurrencyCode;
          const rate = data.pricingMatchDataSearchContext.Rate;
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
            PagingOptions: pagingOptions,
            Rate: rate
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
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromSurveySearchResultsActions.GetExchangeDataResults, filters, pricingMatchDataSearchContext, selectedDataCuts) =>
          ({ action, filters, pricingMatchDataSearchContext, selectedDataCuts })),
      mergeMap((data) => {
          const exchangeJobId = data.action.payload.exchangeJobId;
          const currencyCode = data.pricingMatchDataSearchContext.CurrencyCode;
          const countryCode = data.pricingMatchDataSearchContext.CountryCode;
          const rate = data.pricingMatchDataSearchContext.Rate;
          const searchFieldsRequestObj = this.payfactorsSearchApiHelper.getTextFiltersWithValuesAsSearchFields(data.filters);
          const filtersRequestObj = this.payfactorsSearchApiHelper.getSelectedFiltersAsSearchFilters(data.filters);

          return this.surveySearchApiService.getExchangeJobData({
            ExchangeJobId: exchangeJobId,
            SearchFields: searchFieldsRequestObj,
            Filters: filtersRequestObj,
            CurrencyCode: currencyCode,
            CountryCode: countryCode,
            Rate: rate
          })
            .pipe(
              map(response => new fromSurveySearchResultsActions.GetExchangeDataResultsSuccess({
                ExchangeJobId: exchangeJobId,
                DataCuts: PayfactorsSurveySearchApiModelMapper.mapExchangeJobDataCutResponseToDataCut(response.DataCuts, data.selectedDataCuts)
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
    this.actions$.pipe(ofType(fromSurveySearchResultsActions.ADD_JOB_RESULTS))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromSurveySearchReducer.State>,
    private surveySearchEffectsService: SurveySearchEffectsService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
