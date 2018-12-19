import { Action } from '@ngrx/store';

export const SET_CONTEXT = '[Project Add Jobs/Add Jobs Page] Set Context';
export const ADD_SELECTED_JOBS = '[Project Add Jobs/Add Jobs Page] Add Selected Jobs';
export const ADD_SELECTED_JOBS_SUCCESS = '[Project Add Jobs/Add Jobs Page] Add Selected Jobs Success';
export const ADD_SELECTED_JOBS_ERROR = '[Project Add Jobs/Add Jobs Page] Add Selected Jobs Error';

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: { PayMarketId: number, ProjectId: number}) {}
}

export class AddSelectedJobs implements Action {
  readonly type = ADD_SELECTED_JOBS;

  constructor() {}
}

export class AddSelectedJobsSuccess implements Action {
  readonly type = ADD_SELECTED_JOBS_SUCCESS;

  constructor() {}
}

export class AddSelectedJobsError implements Action {
  readonly type = ADD_SELECTED_JOBS_ERROR;

  constructor() {}
}

export type Actions
  = SetContext
  | AddSelectedJobs
  | AddSelectedJobsSuccess
  | AddSelectedJobsError;
