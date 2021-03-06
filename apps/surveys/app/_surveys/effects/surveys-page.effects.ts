import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, mergeMap } from 'rxjs/operators';

import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { SurveyApiService } from 'libs/data/payfactors-api/surveys';

import * as fromSurveyPageActions from '../actions/surveys-page.actions';
import { SurveysPageConfig } from '../models';

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

  @Effect()
  reloadSurveyDataGrid$ = this.actions$
    .pipe(
      ofType(fromSurveyPageActions.RELOAD_SURVEY_DATA_GRID),
      mergeMap((action: fromSurveyPageActions.ReloadSurveyDataGrid) => {
        return [
          new fromSurveyPageActions.ReloadSurveyDataGridSuccess(action.surveyJobId),
          new fromPfDataGridActions.LoadViewConfig(`${SurveysPageConfig.SurveyDataCutsPageViewId}_${action.surveyJobId}`)
        ];
      })
    );

  @Effect()
  getSurveyJobDetails$ = this.actions$
    .pipe(
      ofType(fromSurveyPageActions.GET_SURVEY_JOB_DETAILS),
      switchMap((action: fromSurveyPageActions.GetSurveyJobDetails) => {
        return this.surveyApiService.getSurveyJobDetails(action.surveyJobId)
          .pipe(
            map((response) => {
              return new fromSurveyPageActions.GetSurveyJobDetailsSuccess(response);
            }),
            catchError(() => of(new fromSurveyPageActions.GetSurveyJobDetailsError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyApiService: SurveyApiService
  ) {}
}
