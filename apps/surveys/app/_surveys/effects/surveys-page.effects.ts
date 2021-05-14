import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { SurveyApiService } from 'libs/data/payfactors-api/surveys';

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

  @Effect()
  getSurveyCountries$ = this.actions$
    .pipe(
      ofType(fromSurveyPageActions.GET_SURVEY_COUNTRIES),
      switchMap((action: fromSurveyPageActions.GetSurveyCountries) => {
        return this.surveyApiService.getAccessibleSurveyCountries()
          .pipe(
            map((response) => new fromSurveyPageActions.GetSurveyCountriesSuccess(response)),
            catchError(() => of(new fromSurveyPageActions.GetSurveyCountriesError()))
          );
      })
    );

  @Effect()
  getSurveyYears$ = this.actions$
    .pipe(
      ofType(fromSurveyPageActions.GET_SURVEY_YEARS),
      switchMap((action: fromSurveyPageActions.GetSurveyYears) => {
        return this.surveyApiService.getSurveyYears()
          .pipe(
            map((response) => new fromSurveyPageActions.GetSurveyYearsSuccess(response)),
            catchError(() => of(new fromSurveyPageActions.GetSurveyYearsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyApiService: SurveyApiService,
  ) {}
}
