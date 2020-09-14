import { Action } from '@ngrx/store';
import { ReScopeSurveyDataContext } from '../models/re-scope-survey-data-context';

export const RE_SCOPE_SURVEY_DATA_ERROR = '[Re Scope Survey Data] Re Scope Survey Data Error';
export const GET_RE_SCOPE_SURVEY_DATA_CONTEXT = '[Re Scope Survey Data] Get Re Scope Data Context';
export const GET_RE_SCOPE_SURVEY_DATA_CONTEXT_SUCCESS = '[Re Scope Survey Data] Get Re Scope Data Context Success';

export class ReScopeSurveyDataError implements Action {
  readonly type = RE_SCOPE_SURVEY_DATA_ERROR;
  constructor(public payload: any) {}
}

export class GetReScopeSurveyDataContext implements Action {
  readonly type = GET_RE_SCOPE_SURVEY_DATA_CONTEXT;
  constructor(public payload: number) {}
}

export class GetReScopeSurveyDataContextSuccess implements Action {
  readonly type = GET_RE_SCOPE_SURVEY_DATA_CONTEXT_SUCCESS;
  constructor(public payload: ReScopeSurveyDataContext) {}
}

export type Actions = GetReScopeSurveyDataContext
  | GetReScopeSurveyDataContextSuccess
  | ReScopeSurveyDataError;