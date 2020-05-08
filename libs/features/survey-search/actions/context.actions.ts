import { Action } from '@ngrx/store';

import { SearchContext, JobContext } from '../models';

export const SET_JOB_CONTEXT = '[Survey Search/Context] Set Job Context';
export const SET_PROJECT_SEARCH_CONTEXT = '[Survey Search/Context] Set Project Search Context';
export const TOGGLE_FILTER_SEARCH = '[Survey Search/Context] Toggle Filter Search';
export const HIDE_FILTER_SEARCH = '[Survey Search/Context] Hide Filter Search';

export class SetJobContext implements Action {
  readonly type = SET_JOB_CONTEXT;

  constructor(public payload: JobContext) {}
}

export class SetProjectSearchContext implements Action {
  readonly type = SET_PROJECT_SEARCH_CONTEXT;

  constructor(public payload: SearchContext) {}
}

export class ToggleFilterSearch implements Action {
  readonly type = TOGGLE_FILTER_SEARCH;

  constructor() {}
}

export class HideFilterSearch implements Action {
  readonly type = HIDE_FILTER_SEARCH;

  constructor() {}
}

export type Actions
  = SetJobContext
  | SetProjectSearchContext
  | ToggleFilterSearch
  | HideFilterSearch;
