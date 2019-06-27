import { Action } from '@ngrx/store';

import { Company } from 'libs/models/company/company.model';

import { DataListItem, MatchResult, SurveyScope } from '../models';

export const LOAD_COMPANY = '[Pf-Admin/YoyDefaultScopesPage] Load Company';
export const LOAD_COMPANY_SUCCESS = '[Pf-Admin/YoyDefaultScopesPage] Load Company Success';
export const LOAD_COMPANY_ERROR = '[Pf-Admin/YoyDefaultScopesPage] Load Company Error';
export const LOAD_DEFAULT_SCOPE_SURVEYS = '[Pf-Admin/YoyDefaultScopesPage] Load Default Scope Surveys';
export const LOAD_DEFAULT_SCOPE_SURVEYS_SUCCESS = '[Pf-Admin/YoyDefaultScopesPage] Load Default Scope Surveys Success';
export const LOAD_DEFAULT_SCOPE_SURVEYS_ERROR = '[Pf-Admin/YoyDefaultScopesPage] Load Default Scope Surveys Error';
export const SET_SELECTED_SURVEY = '[Pf-Admin/YoyDefaultScopesPage] Set Selected Survey';
export const LOAD_MATCH_RESULTS = '[Pf-Admin/YoyDefaultScopesPage] Load Match Results';
export const LOAD_MATCH_RESULTS_SUCCESS = '[Pf-Admin/YoyDefaultScopesPage] Load Match Results Success';
export const LOAD_MATCH_RESULTS_ERROR = '[Pf-Admin/YoyDefaultScopesPage] Load Match Results Error';
export const SET_SELECTED_MATCH_RESULT = '[Pf-Admin/YoyDefaultScopesPage] Set Selected Match Result';
export const FILTER_MATCH_RESULTS = '[Pf-Admin/YoyDefaultScopesPage] Filter Match Results';
export const LOAD_SURVEY_SCOPES = '[Pf-Admin/YoyDefaultScopesPage] Load Survey Scopes';
export const LOAD_SURVEY_SCOPES_SUCCESS = '[Pf-Admin/YoyDefaultScopesPage] Load Survey Scopes Success';
export const LOAD_SURVEY_SCOPES_ERROR = '[Pf-Admin/YoyDefaultScopesPage] Load Survey Scopes Error';
export const SET_SELECTED_SURVEY_SCOPE = '[Pf-Admin/YoyDefaultScopesPage] Set Selected Survey Scope';
export const APPLY_MATCH = '[Pf-Admin/YoyDefaultScopesPage] Apply Match';
export const APPLY_MATCH_SUCCESS = '[Pf-Admin/YoyDefaultScopesPage] Apply Match Success';
export const APPLY_MATCH_ERROR = '[Pf-Admin/YoyDefaultScopesPage] Apply Match Error';
export const RESET = '[Pf-Admin/YoyDefaultScopesPage] Reset';

export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;

  constructor(public payload: { companyId: number }) { }
}

export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;

  constructor(public payload: Company) { }
}

export class LoadCompanyError implements Action {
    readonly type = LOAD_COMPANY_ERROR;
}

export class LoadDefaultScopeSurveys implements Action {
  readonly type = LOAD_DEFAULT_SCOPE_SURVEYS;

  constructor(public payload: { companyId: number }) { }
}

export class LoadDefaultScopeSurveysSuccess implements Action {
  readonly type = LOAD_DEFAULT_SCOPE_SURVEYS_SUCCESS;

  constructor(public payload: DataListItem[]) { }
}

export class LoadDefaultScopeSurveysError implements Action {
  readonly type = LOAD_DEFAULT_SCOPE_SURVEYS_ERROR;
}

export class SetSelectedSurvey implements Action {
  readonly type = SET_SELECTED_SURVEY;

  constructor(public payload: DataListItem) { }
}

export class LoadMatchResults implements Action {
  readonly type = LOAD_MATCH_RESULTS;

  constructor(public payload: { surveyId: number }) { }
}

export class LoadMatchResultsSuccess implements Action {
  readonly type = LOAD_MATCH_RESULTS_SUCCESS;

  constructor(public payload: MatchResult[]) { }
}

export class LoadMatchResultsError implements Action {
  readonly type = LOAD_MATCH_RESULTS_ERROR;
}

export class SetSelectedMatchResult implements Action {
  readonly type = SET_SELECTED_MATCH_RESULT;

  constructor(public payload: MatchResult) {}
}

export class FilterMatchResults implements Action {
  readonly type = FILTER_MATCH_RESULTS;

  constructor(public payload: {type: string}) {}
}

export class LoadSurveyScopes implements Action {
  readonly type = LOAD_SURVEY_SCOPES;

  constructor(public payload: { surveyId: number }) { }
}

export class LoadSurveyScopesSuccess implements Action {
  readonly type = LOAD_SURVEY_SCOPES_SUCCESS;

  constructor(public payload: SurveyScope[]) { }
}

export class LoadSurveyScopesError implements Action {
  readonly type = LOAD_SURVEY_SCOPES_ERROR;
}

export class SetSelectedSurveyScope implements Action {
  readonly type = SET_SELECTED_SURVEY_SCOPE;

  constructor(public payload: SurveyScope) { }
}

export class ApplyMatch implements Action {
  readonly type = APPLY_MATCH;

  constructor(public payload?: MatchResult) { }
}

export class ApplyMatchSuccess implements Action {
  readonly type = APPLY_MATCH_SUCCESS;
}

export class ApplyMatchError implements Action {
  readonly type = APPLY_MATCH_ERROR;
}

export class Reset implements Action {
  readonly type = RESET;
}

export type Actions
  = LoadCompany
  | LoadCompanySuccess
  | LoadCompanyError
  | LoadDefaultScopeSurveys
  | LoadDefaultScopeSurveysSuccess
  | LoadDefaultScopeSurveysError
  | SetSelectedSurvey
  | LoadMatchResults
  | LoadMatchResultsSuccess
  | LoadMatchResultsError
  | SetSelectedMatchResult
  | FilterMatchResults
  | LoadSurveyScopes
  | LoadSurveyScopesSuccess
  | LoadSurveyScopesError
  | SetSelectedSurveyScope
  | ApplyMatch
  | ApplyMatchSuccess
  | ApplyMatchError
  | Reset;
