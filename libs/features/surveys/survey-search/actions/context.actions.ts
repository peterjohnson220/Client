import { Action } from '@ngrx/store';

import { ProjectSearchContext, JobContext, ModifyPricingsSearchContext } from '../models';

export const SET_JOB_CONTEXT = '[Survey Search/Context] Set Job Context';
export const SET_PROJECT_SEARCH_CONTEXT = '[Survey Search/Context] Set Project Search Context';
export const TOGGLE_FILTER_SEARCH = '[Survey Search/Context] Toggle Filter Search';
export const HIDE_FILTER_SEARCH = '[Survey Search/Context] Hide Filter Search';
export const SET_MODIFY_PRICINGS_SEARCH_CONTEXT = '[Survey Search/Context] Set Modify Pricings Context';

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

export class SetModifyPricingsSearchContext implements Action {
  readonly type = SET_MODIFY_PRICINGS_SEARCH_CONTEXT;
  constructor(public payload: ModifyPricingsSearchContext) {}
}

export type Actions
  = SetJobContext
  | SetProjectSearchContext
  | ToggleFilterSearch
  | HideFilterSearch
  | SetModifyPricingsSearchContext;
