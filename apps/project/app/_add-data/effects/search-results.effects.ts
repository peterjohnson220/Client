import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, withLatestFrom} from 'rxjs/operators';

import {SurveySearchApiService} from 'libs/data/payfactors-api/surveys';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromJobResultActions from '../actions/search-results.actions';
import { AddDataEffectsService } from '../services';
import * as fromAddDataReducer from '../reducers';
import {mapFiltersToSearchFields, mapFiltersToSearchFilters} from '../helpers';


@Injectable()
export class SearchResultsEffects {

  @Effect()
  searchSurveyJobsOnGetMoreResults$ = this.addDataEffectsService.searchSurveyJobs(
    this.actions$.ofType(fromSearchResultsActions.GET_MORE_RESULTS)
  );

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
	this.store.select(fromAddDataReducer.getJobContext),
        (action: fromJobResultActions.GetSurveyDataResults, filters, jobContext) => ({ action, filters, jobContext })),
      mergeMap((dataCutContext) => {
          const surveyJobId = dataCutContext.action.payload.Id;
	  const currencyCode = dataCutContext.jobContext.CurrencyCode;

          const searchFieldsRequestObj = mapFiltersToSearchFields(dataCutContext.filters);
          const filtersRequestObj = mapFiltersToSearchFilters(dataCutContext.filters);
          return this.surveySearchApiService.searchDataCuts({
            SurveyJobId: surveyJobId,
            SearchFields: searchFieldsRequestObj,
            Filters: filtersRequestObj,
	    CurrencyCode: currencyCode
          })
            .pipe(
              map(response => new fromJobResultActions.GetSurveyDataResultsSuccess({
                SurveyJobId: surveyJobId,
                DataCuts: response}))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromAddDataReducer.State>,
    private addDataEffectsService: AddDataEffectsService,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
