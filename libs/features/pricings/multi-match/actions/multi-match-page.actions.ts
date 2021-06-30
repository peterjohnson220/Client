import { Action } from '@ngrx/store';
import { ProjectContext, ProjectSearchContext } from '../../../surveys/survey-search/models';

export const SET_PROJECT_CONTEXT = '[Project Add Data/Multi Match Page] Set Project Context';
export const GET_PROJECT_SEARCH_CONTEXT = '[Project Add Data/Multi Match Page] Get Project Search Context';
export const GET_PROJECT_SEARCH_CONTEXT_SUCCESS = '[Project Add Data/Multi Match Page] Get Project Search Context Success';
export const SAVE_JOB_MATCH_UPDATES = '[Project Add Data/Multi Match Page] Save Job Match Changes';
export const SAVE_JOB_MATCH_UPDATES_SUCCESS = '[Project Add Data/Multi Match Page] Save Job Match Changes Success';
export const SAVE_JOB_MATCH_UPDATES_ERROR = '[Project Add Data/Multi Match Page] Save Job Match Changes Error';
export const SET_MULTI_MATCH_MODAL_STATUS = '[Project Add Data/Multi Match Page] Set Multi Match Modal Status';

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

export class SetMultiMatchModalStatus implements Action {
  readonly type = SET_MULTI_MATCH_MODAL_STATUS;

  constructor(public payload: boolean) {}
}

export type Actions
  = SetProjectContext
  | GetProjectSearchContext
  | GetProjectSearchContextSuccess
  | SaveJobMatchUpdates
  | SaveJobMatchUpdatesSuccess
  | SaveJobMatchUpdatesError
  | SetMultiMatchModalStatus;
