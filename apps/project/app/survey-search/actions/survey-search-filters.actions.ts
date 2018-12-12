import { Action } from '@ngrx/store';

export const GET_DEFAULT_SURVEY_SCOPES_FILTER = '[Shared Survey Search] Get Default Survey Scopes Filter';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS = '[Shared Survey Search] Get Default Survey Scopes Filter Success';

export class GetDefaultScopesFilter implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER;
}

export class GetDefaultScopesFilterSuccess implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS;

  constructor() {}
}

export type Actions
  =  GetDefaultScopesFilter
  | GetDefaultScopesFilterSuccess;
