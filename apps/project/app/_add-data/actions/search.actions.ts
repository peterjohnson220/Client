import { Action } from '@ngrx/store';

import { ProjectSearchContext } from '../models';

export const SET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Search Page] Set Project Search Context';
export const TOGGLE_FILTER_SEARCH = '[Project Add Data/Search Page] Toggle Filter Search';
export const HIDE_FILTER_SEARCH = '[Project Add Data/Search Page] Hide Filter Search';

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

export type Actions
  = SetProjectSearchContext
  | ToggleFilterSearch
  | HideFilterSearch;
