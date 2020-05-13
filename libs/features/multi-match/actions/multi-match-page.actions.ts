import { Action } from '@ngrx/store';
import { ProjectContext, SearchContext } from '../../survey-search/models';

export const SET_PROJECT_CONTEXT = '[Project Add Data/Multi Match Page] Set Project Context';
export const GET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Multi Match Page] Get Project Search Context';
export const GET_PROJECT_SEARCH_CONTEXT_SUCCESS = '[Project Add Data/Multi Match Page] Get Project Search Context Success';
export const SAVE_JOB_MATCH_UPDATES = '[Project Add Data/Multi Match Page] Save Job Match Changes';
export const SAVE_JOB_MATCH_UPDATES_SUCCESS = '[Project Add Data/Multi Match Page] Save Job Match Changes Success';
export const SAVE_JOB_MATCH_UPDATES_ERROR = '[Project Add Data/Multi Match Page] Save Job Match Changes Error';

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

  constructor(public payload: SearchContext) {}
}

export class SaveJobMatchUpdates implements Action {
  readonly type = SAVE_JOB_MATCH_UPDATES;

  constructor() {}
}

export class SaveJobMatchUpdatesSuccess implements Action {
  readonly type = SAVE_JOB_MATCH_UPDATES_SUCCESS;

  constructor() {}
}

export class SaveJobMatchUpdatesError implements Action {
  readonly type = SAVE_JOB_MATCH_UPDATES_ERROR;

  constructor() {}
}

export type Actions
  = SetProjectContext
  | GetProjectSearchContext
  | GetProjectSearchContextSuccess
  | SaveJobMatchUpdates
  | SaveJobMatchUpdatesSuccess
  | SaveJobMatchUpdatesError;
