import { Action } from '@ngrx/store';
import { BaseSearchRequest } from 'libs/models/payfactors-api';

export const SET_CONTEXT = '[Add Jobs/Add Jobs Page] Set Context';
export const SET_CONTEXT_STRUCTURES_RANGE_GROUP_ID = '[Add Jobs/Add Jobs Page] Set Structures Range Group Id';
export const ADD_ALL_JOBS = '[Add Jobs/Add Jobs Page] Add All Jobs';
export const ADD_SELECTED_JOBS = '[Add Jobs/Add Jobs Page] Add Selected Jobs';
export const ADD_JOBS_SUCCESS = '[Add Jobs/Add Jobs Page] Add Jobs Success';
export const ADD_JOBS_ERROR = '[Add Jobs/Add Jobs Page] Add Jobs Error';

export class SetContext implements Action {
  readonly type = SET_CONTEXT;

  constructor(public payload: { PayMarketId: number, ProjectId: number }) {}
}

export class SetContextStructuresRangeGroupId implements Action {
  readonly type = SET_CONTEXT_STRUCTURES_RANGE_GROUP_ID;

  constructor(public payload: number) {}
}

export class AddSelectedJobs implements Action {
  readonly type = ADD_SELECTED_JOBS;

  constructor() {}
}

export class AddAllJobs implements Action {
  readonly type = ADD_ALL_JOBS;

  constructor() {}
}

export class AddJobsSuccess implements Action {
  readonly type = ADD_JOBS_SUCCESS;

  constructor() {}
}

export class AddJobsError implements Action {
  readonly type = ADD_JOBS_ERROR;

  constructor(public error: any) { }
}

export type Actions
  = SetContext
  | SetContextStructuresRangeGroupId
  | AddSelectedJobs
  | AddAllJobs
  | AddJobsSuccess
  | AddJobsError;
