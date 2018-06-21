import { Action } from '@ngrx/store';

import { SearchFilter } from 'libs/models/search';

import { JobContext } from '../models';

export const GET_DEFAULT_SURVEY_SCOPES_FILTER = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter';
export const GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS = '[Project Add Data/Add Survey Data Page] Get Default Survey Scopes Filter Success';
export const SET_JOB_CONTEXT = '[Project Add Data/Add Survey Data Page] Set Job Context';
export const CLOSE_SURVEY_SEARCH = '[Project Add Data/Add Survey Data Page] Close Survey Search';

export class GetDefaultScopesFilter implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER;
}

export class GetDefaultScopesFilterSuccess implements Action {
  readonly type = GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS;

  constructor(public payload: SearchFilter) {}
}

export class SetJobContext implements Action {
  readonly type = SET_JOB_CONTEXT;

  constructor(public payload: JobContext) {}
}

export class CloseSurveySearch implements Action {
  readonly type = CLOSE_SURVEY_SEARCH;

  constructor() {}
}

export type Actions
  = GetDefaultScopesFilter
  | GetDefaultScopesFilterSuccess
  | SetJobContext
  | CloseSurveySearch;
