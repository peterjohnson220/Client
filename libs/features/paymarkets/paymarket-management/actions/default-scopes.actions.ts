import { Action } from '@ngrx/store';

import { GetCompanySurveysRequest, GetCompanySurveysResponse } from 'libs/models/payfactors-api';
import { CombinedScope, DefaultScope } from '../models';

export const LOAD_COMPANY_SURVEYS = '[Pay Market Management / Default Scopes] Load Company Surveys';
export const LOAD_COMPANY_SURVEYS_SUCCESS = '[Pay Market Management / Default Scopes] Load Company Surveys Success';
export const LOAD_COMPANY_SURVEYS_ERROR = '[Pay Market Management / Default Scopes] Load Company Surveys Error';
export const LOAD_MORE_COMPANY_SURVEYS_SUCCESS = '[Pay Market Management / Default Scopes] Load More Company Surveys Success';
export const LOAD_COMBINED_SCOPES = '[Pay Market Management / Default Scopes] Load Combined Scopes';
export const LOAD_COMBINED_SCOPES_SUCCESS = '[Pay Market Management / Default Scopes] Load Combined Scopes Success';
export const LOAD_COMBINED_SCOPES_ERROR = '[Pay Market Management / Default Scopes] Load Combined Scopes Error';
export const ADD_DEFAULT_SCOPE = '[Pay Market Management / Default Scopes] Add Default Scope';
export const REMOVE_DEFAULT_SCOPE = '[Pay Market Management / Default Scopes] Remove Default Scope';
export const RESET_DEFAULT_SCOPES = '[Pay Market Management / Default Scopes] Reset Default Scopes';
export const LOAD_DEFAULT_SCOPES = '[Pay Market Management / Default Scopes] Load Default Scopes';
export const LOAD_DEFAULT_SCOPES_SUCCESS = '[Pay Market Management / Default Scopes] Load Default Scopes Success';
export const LOAD_DEFAULT_SCOPES_ERROR = '[Pay Market Management / Default Scopes] Load Default Scopes Error';

export class LoadCompanySurveys implements Action {
  readonly type = LOAD_COMPANY_SURVEYS;
  constructor(public payload: GetCompanySurveysRequest) {}
}

export class LoadCompanySurveysSuccess implements Action {
  readonly type = LOAD_COMPANY_SURVEYS_SUCCESS;
  constructor(public payload: GetCompanySurveysResponse) {}
}

export class LoadCompanySurveysError implements Action {
  readonly type = LOAD_COMPANY_SURVEYS_ERROR;
  constructor() {}
}

export class LoadMoreCompanySurveySuccess implements Action {
  readonly type = LOAD_MORE_COMPANY_SURVEYS_SUCCESS;
  constructor(public payload: GetCompanySurveysResponse) {}
}

export class LoadCombinedScopes implements Action {
  readonly type = LOAD_COMBINED_SCOPES;
  constructor(public payload: { surveyId: number }) {}
}

export class LoadCombinedScopesSuccess implements Action {
  readonly type = LOAD_COMBINED_SCOPES_SUCCESS;
  constructor(public payload: CombinedScope[]) {}
}

export class LoadCombinedScopesError implements Action {
  readonly type = LOAD_COMBINED_SCOPES_ERROR;
  constructor() {}
}

export class AddDefaultScope implements Action {
  readonly type = ADD_DEFAULT_SCOPE;
  constructor(public payload: DefaultScope) {}
}

export class RemoveDefaultScope implements Action {
  readonly type = REMOVE_DEFAULT_SCOPE;
  constructor(public payload: { defaultScopeIndex: number }) {}
}

export class ResetDefaultScopes implements Action {
  readonly type = RESET_DEFAULT_SCOPES;
  constructor() {}
}

export class LoadDefaultScopes implements Action {
  readonly type = LOAD_DEFAULT_SCOPES;
  constructor(public payload: { payMarketId: number }) {}
}

export class LoadDefaultScopesSuccess implements Action {
  readonly type = LOAD_DEFAULT_SCOPES_SUCCESS;
  constructor(public payload: DefaultScope[]) {}
}

export class LoadDefaultScopesError implements Action {
  readonly type = LOAD_DEFAULT_SCOPES_ERROR;
  constructor() {}
}

export type Actions
  = LoadCompanySurveys
  | LoadCompanySurveysSuccess
  | LoadCompanySurveysError
  | LoadMoreCompanySurveySuccess
  | LoadCombinedScopes
  | LoadCombinedScopesSuccess
  | LoadCombinedScopesError
  | AddDefaultScope
  | RemoveDefaultScope
  | ResetDefaultScopes
  | LoadDefaultScopes
  | LoadDefaultScopesSuccess
  | LoadDefaultScopesError;
