import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, withLatestFrom} from 'rxjs/operators';

import {SurveySearchApiService} from 'libs/data/payfactors-api/surveys';
import { PagingOptions } from 'libs/models';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromJobResultActions from '../actions/search-results.actions';
import { AddDataEffectsService } from '../services';
import * as fromAddDataReducer from '../reducers';
import {mapFiltersToSearchFields, getSelectedSearchFilters} from '../helpers';

@Injectable()
export class SearchResultsEffects {

  @Effect()
  getResults$ = this.addDataEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS)
  );

  @Effect()
  getSurveyDataCutResults$ = this.actions$
    .ofType(fromJobResultActions.GET_SURVEY_DATA_RESULTS)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getFilters),
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        (action: fromJobResultActions.GetSurveyDataResults, filters, projectSearchContext) => ({ action, filters, projectSearchContext })),
      mergeMap((dataCutContext) => {
          const surveyJobId = dataCutContext.action.payload.Id;
          const currencyCode = dataCutContext.projectSearchContext.CurrencyCode;
          const projectId = dataCutContext.projectSearchContext.ProjectId;
          const searchFieldsRequestObj = mapFiltersToSearchFields(dataCutContext.filters);
          const filtersRequestObj = getSelectedSearchFilters(dataCutContext.filters);
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
              }))
            );
        }
      ));

  @Effect()
  getMoreResults$ = this.addDataEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS)
  );

  @Effect()
  getResultsSuccess$ = this.addDataEffectsService.loadPricingMatches(
    this.actions$.ofType(fromSearchResultsActions.GET_RESULTS_SUCCESS)
  );

  @Effect()
  getMoreResultsSuccess$ = this.addDataEffectsService.loadPricingMatches(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS)
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAddDataReducer.State>,
    private addDataEffectsService: AddDataEffectsService,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
