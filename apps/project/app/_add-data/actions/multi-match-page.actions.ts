import { Action } from '@ngrx/store';
import {ProjectContext, ProjectSearchContext} from '../models';

export const SET_PROJECT_CONTEXT = '[Project Add Data/Multi Match Page] Set Project Context';
export const GET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Multi Match Page] Get Project Search Context';
export const GET_PROJECT_SEARCH_CONTEXT_SUCCESS = '[Project Add Data/Multi Match Page] Get Project Search Context Success';
export const CLOSE_MULTI_MATCH = '[Project Add Data/Multi Match Page] Close Multi Match';
export const TOGGLE_FILTER_SEARCH = '[Project Add Data/Multi Match Page] Toggle Filter Search';

export class SetProjectContext implements Action {
  readonly type = SET_PROJECT_CONTEXT;

  constructor(public payload: ProjectContext) {}
}

export class GetProjectSearchContext implements Action {
  readonly type = GET_PROJECT_SEARCH_CONTEXT;

  constructor(public payload: ProjectContext) {}
}

export class GetProjectSearchContextSuccess implements Action {
  readonly type = GET_PROJECT_SEARCH_CONTEXT_SUCCESS;

  constructor(public payload: ProjectSearchContext) {}
}

export class CloseMultiMatch implements Action {
  readonly type = CLOSE_MULTI_MATCH;

  constructor() {}
}

export class ToggleFilterSearch implements Action {
  readonly type = TOGGLE_FILTER_SEARCH;

  constructor() {}
}

export type Actions
  = SetProjectContext
  | GetProjectSearchContext
  | GetProjectSearchContextSuccess
  | CloseMultiMatch
  | ToggleFilterSearch;
