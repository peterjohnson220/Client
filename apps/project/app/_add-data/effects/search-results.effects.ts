import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, withLatestFrom} from 'rxjs/operators';

import {SurveySearchApiService} from 'libs/data/payfactors-api/surveys';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromJobResultActions from '../actions/search-results.actions';
import { AddDataEffectsService } from '../services';
import * as fromAddDataReducer from '../reducers';
import {getCombinedScope} from '../helpers';


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
        (action: fromJobResultActions.GetSurveyDataResults, filters) => ({ action, filters })),
      mergeMap((dataCutContext) => {
          const surveyJobId = dataCutContext.action.payload.Id;
          const combinedScope = getCombinedScope(dataCutContext.filters);
          return this.surveySearchApiService.searchDataCuts({SurveyJobId: surveyJobId,
            CombinedScope: combinedScope })
            .pipe(
              map(response => new fromJobResultActions.GetSurveyDataResultsSuccess({SurveyJobId: surveyJobId,
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
