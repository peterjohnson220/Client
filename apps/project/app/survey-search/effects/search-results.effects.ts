import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/index';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
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
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS)
  );

  @Effect()
  getSurveyDataCutResults$ = this.actions$
    .ofType(fromSurveySearchResultsActions.GET_SURVEY_DATA_RESULTS)
    .pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getFilters),
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
                DataCuts: PayfactorsSurveySearchApiModelMapper.mapSurveyDataCutResultsToDataCut(response.DataCuts, data.selectedDataCuts),
                TotalResults: response.TotalResults
              })),
              catchError(() => of(new fromSurveySearchResultsActions.GetSurveyDataResultsError(surveyJobId)))
            );
        }
      ));

  @Effect()
  getMoreResults$ = this.surveySearchEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS)
  );

  @Effect()
  getResultsSuccess$ = this.surveySearchEffectsService.loadPricingMatches(
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS_SUCCESS)
  );

  @Effect()
  getMoreResultsSuccess$ = this.surveySearchEffectsService.loadPricingMatches(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS)
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromSurveySearchReducer.State>,
    private surveySearchEffectsService: SurveySearchEffectsService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
