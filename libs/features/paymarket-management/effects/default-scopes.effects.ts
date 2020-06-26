import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { SurveyApiService, PayMarketApiService } from 'libs/data/payfactors-api';

import * as fromDefaultScopesActions from '../actions/default-scopes.actions';
import { DefaultScopesHelper } from '../helpers';

@Injectable()
export class DefaultScopesEffects {

  @Effect()
  loadSurveys$ = this.actions$
    .pipe(
      ofType(fromDefaultScopesActions.LOAD_COMPANY_SURVEYS),
      switchMap((action: fromDefaultScopesActions.LoadCompanySurveys) => {
        return this.surveyApiService.getCompanySurveys(action.payload)
          .pipe(
            map((response) => {
              if (action.payload.PagingOptions.From > 0) {
                return new fromDefaultScopesActions.LoadMoreCompanySurveySuccess(response);
              }
              return new fromDefaultScopesActions.LoadCompanySurveysSuccess(response);
            }),
            catchError(() => of(new fromDefaultScopesActions.LoadCompanySurveysError()))
          );
      })
    );

  @Effect()
  loadCombinedScopes$ = this.actions$
    .pipe(
      ofType(fromDefaultScopesActions.LOAD_COMBINED_SCOPES),
      switchMap((action: fromDefaultScopesActions.LoadCombinedScopes) => {
        return this.surveyApiService.getScopesBySurvey(action.payload.surveyId)
          .pipe(
            map((response) => {
              return new fromDefaultScopesActions.LoadCombinedScopesSuccess(
                DefaultScopesHelper.mapCombinedScopeViewModelsToCombinedScopes(response)
              );
            }),
            catchError(() => of(new fromDefaultScopesActions.LoadCombinedScopesError()))
          );
      })
    );

  @Effect()
  loadDefaultScopes$ = this.actions$
    .pipe(
      ofType(fromDefaultScopesActions.LOAD_DEFAULT_SCOPES),
      switchMap((action: fromDefaultScopesActions.LoadDefaultScopes) => {
        return this.payMarketApiService.getDefaultScopeAndSurveyInfo(action.payload.payMarketId)
          .pipe(
            map((response) => {
              const defaultScopes = DefaultScopesHelper.mapSurveyAndScopesToDefaultScopes(response);
              return new fromDefaultScopesActions.LoadDefaultScopesSuccess(defaultScopes);
            }),
            catchError(() => of(new fromDefaultScopesActions.LoadDefaultScopesError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private surveyApiService: SurveyApiService,
    private payMarketApiService: PayMarketApiService
  ) {}
}
