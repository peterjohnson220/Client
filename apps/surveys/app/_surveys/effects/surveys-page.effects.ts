import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { SurveyApiService } from 'libs/data/payfactors-api/index';

import * as fromSurveyPageActions from '../actions/surveys-page.actions';

@Injectable()
export class SurveyPageEffects {

  @Effect()
  getSurveyParticipants$ = this.actions$
    .pipe(
      ofType(fromSurveyPageActions.GET_SURVEY_PARTICIPANTS),
      switchMap((action: fromSurveyPageActions.GetSurveyParticipants) => {
        return this.surveyApiService.getSurveyParticipants(action.payload)
          .pipe(
            map((response) => {
              return new fromSurveyPageActions.GetSurveyParticipantsSuccess(response);
            }),
            catchError((error) => of(new fromSurveyPageActions.GetSurveyParticipantsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyApiService: SurveyApiService,
  ) {}
}
