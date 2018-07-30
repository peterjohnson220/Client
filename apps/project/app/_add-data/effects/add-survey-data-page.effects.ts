import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromAddDataReducer from '../reducers';

@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  setJobContext$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.SET_JOB_CONTEXT)
    .pipe(
      map((action: fromAddSurveyDataPageActions.SetJobContext) => action.payload),
      mergeMap(jobContext => [
        new fromSearchFiltersActions.GetDefaultScopesFilter(),
        new fromSearchFiltersActions.UpdateFilterValue({filterId: 'jobTitleCode', value: jobContext.JobTitle})
      ]
    ));

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.CLOSE_SURVEY_SEARCH)
    .pipe(
      tap((action: fromAddSurveyDataPageActions.CloseSurveySearch) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
