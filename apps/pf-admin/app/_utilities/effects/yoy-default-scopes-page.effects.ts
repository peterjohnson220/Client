import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';

import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { SurveyApiService } from 'libs/data/payfactors-api/surveys';

import * as fromYoyDefaultScopesPageActions from '../actions/yoy-default-scopes-page.actions';
import * as fromUtilitiesReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { MatchResult, SurveyScope } from '../models';

@Injectable()
export class YoyDefaultScopesPageEffects {
  @Effect()
  loadCompany$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.LOAD_COMPANY),
    map((action: fromYoyDefaultScopesPageActions.LoadCompany) => action.payload.companyId),
    switchMap((companyId) => {
      return this.companyApiService.get(companyId).pipe(
        map((response) => new fromYoyDefaultScopesPageActions.LoadCompanySuccess(response)),
        catchError(() => of(new fromYoyDefaultScopesPageActions.LoadCompanyError()))
      );
    })
  );

  @Effect()
  loadDefaultScopeSurveys$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.LOAD_DEFAULT_SCOPE_SURVEYS),
    map((action: fromYoyDefaultScopesPageActions.LoadDefaultScopeSurveys) => action.payload.companyId),
    switchMap((companyId) => {
      return this.surveyApiService.getYoyDSSurveys(companyId).pipe(
        map((response) => {
          return new fromYoyDefaultScopesPageActions.LoadDefaultScopeSurveysSuccess(
            PayfactorsApiModelMapper.mapYoyDsSurveysResponseToSurveyListItem(response)
          );
        }),
        catchError(() => of(new fromYoyDefaultScopesPageActions.LoadDefaultScopeSurveysError()))
      );
    })
  );

  @Effect()
  setSelectedSurvey$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.SET_SELECTED_SURVEY),
    map((action: fromYoyDefaultScopesPageActions.SetSelectedSurvey) => {
      return new fromYoyDefaultScopesPageActions.LoadMatchResults({ surveyId: action.payload.Id });
    })
  );

  @Effect()
  loadMatchResults$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.LOAD_MATCH_RESULTS),
    withLatestFrom(
      this.store.pipe(select(fromUtilitiesReducer.getCompany)),
      (action: fromYoyDefaultScopesPageActions.LoadMatchResults, company) => ({action, company})
    ),
    switchMap((data) => {
      return this.surveyApiService.getYoyDSToMap(data.company.CompanyId, data.action.payload.surveyId).pipe(
        mergeMap((response) => {
          const actions = [];
          actions.push(new fromYoyDefaultScopesPageActions.LoadMatchResultsSuccess(
            PayfactorsApiModelMapper.mapYoyDsToMapResponseToMatchResult(response)
          ));

          if (!response.length) {
            actions.push(new fromYoyDefaultScopesPageActions.LoadDefaultScopeSurveys({ companyId: data.company.CompanyId }));
          }

          return actions;
        }),
        catchError(() => of(new fromYoyDefaultScopesPageActions.LoadMatchResultsError()))
      );
    })
  );

  @Effect()
  setSelectedMatchResult$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.SET_SELECTED_MATCH_RESULT),
    map((action: fromYoyDefaultScopesPageActions.SetSelectedMatchResult) => {
      return new fromYoyDefaultScopesPageActions.LoadSurveyScopes({ surveyId: action.payload.NewSurveyId });
    })
  );

  @Effect()
  loadSurveyScopes$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.LOAD_SURVEY_SCOPES),
    switchMap((action: fromYoyDefaultScopesPageActions.LoadSurveyScopes) => {
      return this.surveyApiService.getYoySurveyScopes(action.payload.surveyId).pipe(
        map((response) => {
          return new fromYoyDefaultScopesPageActions.LoadSurveyScopesSuccess(
            PayfactorsApiModelMapper.mapYoySurveyScopesResponseToSurveyScope(response)
          );
        }),
        catchError(() => of(new fromYoyDefaultScopesPageActions.LoadSurveyScopesError()))
      );
    })
  );

  @Effect()
  applyMatch$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.APPLY_MATCH),
    withLatestFrom(
      this.store.pipe(select(fromUtilitiesReducer.getCompany)),
      this.store.pipe(select(fromUtilitiesReducer.getSelectedMatchResult)),
      this.store.pipe(select(fromUtilitiesReducer.getSelectedScope)),
      (action: fromYoyDefaultScopesPageActions.ApplyMatch, company, selectedMatchResult, selectedScope) =>
        ({action, company, selectedMatchResult, selectedScope})
    ),
    switchMap((data) => {
      return this.surveyApiService.mapDefaultScopesYoy(
        PayfactorsApiModelMapper.buildYoYDsMapRequest(
          data.action.payload || this.buildExactMatch(data.selectedMatchResult, data.selectedScope), data.company.CompanyId)
      ).pipe(
        map(() => new fromYoyDefaultScopesPageActions.ApplyMatchSuccess()),
        catchError(() => of(new fromYoyDefaultScopesPageActions.ApplyMatchError()))
      );
    })
  );

  @Effect()
  applyMatchSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromYoyDefaultScopesPageActions.APPLY_MATCH_SUCCESS),
    withLatestFrom(
      this.store.pipe(select(fromUtilitiesReducer.getCompany)),
      this.store.pipe(select(fromUtilitiesReducer.getSelectedDefaultScopeSurvey)),
      (action: fromYoyDefaultScopesPageActions.ApplyMatchSuccess, company, selectedSurvey) =>
        ({action, company, selectedSurvey})
    ),
    mergeMap((data) => [
      new fromYoyDefaultScopesPageActions.LoadMatchResults({surveyId: data.selectedSurvey.Id})
    ])
  );

  buildExactMatch(misMatch: MatchResult, selectedScope: SurveyScope): MatchResult {
    return {
      ...misMatch,
      NewScope1: selectedScope.Scope1,
      NewScope2: selectedScope.Scope2,
      NewScope3: selectedScope.Scope3,
      NewWeightingType: selectedScope.WeightingType
    };
  }

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private surveyApiService: SurveyApiService,
    private store: Store<fromUtilitiesReducer.State>
  ) {
  }
}
