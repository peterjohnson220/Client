import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, withLatestFrom, mergeMap, tap } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromAddDataReducer from '../reducers';

@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  getDefaultSurveyScopesFilter$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.GET_DEFAULT_SURVEY_SCOPES_FILTER)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getJobContext), (action, jobContext) => jobContext),
      switchMap((jobContext) => {
          return this.surveySearchApiService.getDefaultSurveyScopesFilter(jobContext.PayMarketId)
            .pipe(
              map(response => new fromAddSurveyDataPageActions.GetDefaultScopesFilterSuccess(response))
            );
        }
      )
    );

  @Effect()
  setJobContext$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.SET_JOB_CONTEXT)
    .pipe(
      mergeMap(() => [
        new fromAddSurveyDataPageActions.GetDefaultScopesFilter()
      ]
    ));

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.CLOSE_SURVEY_SEARCH)
    .pipe(tap((action: fromAddSurveyDataPageActions.CloseSurveySearch) => {
      this.windowCommunicationService.postMessage(action.type);
    }));

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
