import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/index';

import {SurveySearchApiService} from 'libs/data/payfactors-api/surveys';
import { PagingOptions } from 'libs/models';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromJobResultActions from '../actions/search-results.actions';
import { SurveySearchEffectsService } from '../services';
import * as fromSharedSearchReducer from '../reducers';
import { PayfactorsApiHelper } from '../helpers';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.surveySearchEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS)
  );

  @Effect()
  getSurveyDataCutResults$ = this.actions$
    .ofType(fromJobResultActions.GET_SURVEY_DATA_RESULTS)
    .pipe(
      withLatestFrom(
        this.store.select(fromSharedSearchReducer.getFilters),
        this.store.select(fromSharedSearchReducer.getProjectSearchContext),
        (action: fromJobResultActions.GetSurveyDataResults, filters, projectSearchContext) => ({ action, filters, projectSearchContext })),
      mergeMap((dataCutContext) => {
          const surveyJobId = dataCutContext.action.payload.Id;
          const currencyCode = dataCutContext.projectSearchContext.CurrencyCode;
          const projectId = dataCutContext.projectSearchContext.ProjectId;
          const searchFieldsRequestObj = PayfactorsApiHelper.getTextFiltersWithValuesAsSearchFields(dataCutContext.filters);
          const filtersRequestObj = PayfactorsApiHelper.getSelectedFiltersAsSearchFilters(dataCutContext.filters);
          const pagingOptions: PagingOptions = {
            From: dataCutContext.action.payload.DataCuts.length,
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
              map(response => new fromJobResultActions.GetSurveyDataResultsSuccess({
                SurveyJobId: surveyJobId,
                DataCuts: response.DataCuts,
                TotalResults: response.TotalResults
              })),
              catchError(() => of(new fromJobResultActions.GetSurveyDataResultsError(surveyJobId)))
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
    private store: Store<fromSharedSearchReducer.State>,
    private surveySearchEffectsService: SurveySearchEffectsService,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
