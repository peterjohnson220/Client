import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { SurveyApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSurveyParticipationActions from '../actions/survey-participation.actions';

@Injectable()
export class SurveyParticipationEffects {

  @Effect()
  getSurveyInfo$ = this.actions$
    .pipe(
      ofType(fromSurveyParticipationActions.GET_SURVEY_INFO),
      switchMap((action: fromSurveyParticipationActions.GetSurveyInfo) => {
        return this.surveyApiService.getSurveyInfo(action.payload.withSurveyCountryAssociation)
          .pipe(
            map((response) => {
              return new fromSurveyParticipationActions.GetSurveyInfoSuccess(response);
            }),
            catchError(() => of(new fromSurveyParticipationActions.GetSurveyInfoError()))
          );
      })
    );

  @Effect()
  saveSurveyParticipation$ = this.actions$
    .pipe(
      ofType(fromSurveyParticipationActions.SAVE_SURVEY_PARTICIPATION),
      switchMap((action: fromSurveyParticipationActions.SaveSurveyParticipation) => {
        return this.surveyApiService.saveSurveyParticipation(action.payload)
          .pipe(
            map((response) => new fromSurveyParticipationActions.SaveSurveyParticipationSuccess(response)),
            catchError(() => of(new fromSurveyParticipationActions.SaveSurveyParticipationError(action.payload)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyApiService: SurveyApiService
  ) {}
}
