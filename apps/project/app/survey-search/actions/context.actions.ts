import { Action } from '@ngrx/store';

import { ProjectSearchContext, JobContext } from '../models';

export const CLOSE_SEARCH_PAGE = '[Project Add Data/Search Page] Close Search Page';
export const SET_JOB_CONTEXT = '[Project Add Data/Search Page] Set Job Context';
export const SET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Search Page] Set Project Search Context';
export const TOGGLE_FILTER_SEARCH = '[Project Add Data/Search Page] Toggle Filter Search';
export const HIDE_FILTER_SEARCH = '[Project Add Data/Search Page] Hide Filter Search';
export const HIDE_PAGE = '[Project Add Data/Search Page] Hide Page';

export class CloseSearchPage implements Action {
  readonly type = CLOSE_SEARCH_PAGE;

  constructor() {}
}

export class SetJobContext implements Action {
  readonly type = SET_JOB_CONTEXT;

  constructor(public payload: JobContext) {}
}

export class SetProjectSearchContext implements Action {
  readonly type = SET_PROJECT_SEARCH_CONTEXT;

  constructor(public payload: ProjectSearchContext) {}
}

export class ToggleFilterSearch implements Action {
  readonly type = TOGGLE_FILTER_SEARCH;

  constructor() {}
}

export class HideFilterSearch implements Action {
  readonly type = HIDE_FILTER_SEARCH;

  constructor() {}
}

export class HidePage implements Action {
  readonly type = HIDE_PAGE;

  constructor() {}
}

export type Actions
  = CloseSearchPage
  | SetJobContext
  | SetProjectSearchContext
  | ToggleFilterSearch
  | HideFilterSearch
  | HidePage;
