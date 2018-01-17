import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOADING_AVAILABLE_JOBS  = '[Peer Admin/Available Jobs] Loading Available Jobs';
export const LOADING_AVAILABLE_JOBS_SUCCESS  = '[Peer Admin/Available Jobs] Loading Available Jobs Success';
export const LOADING_AVAILABLE_JOBS_ERROR  = '[Peer Admin/Available Jobs] Loading Available Jobs Error';

export class LoadingAvailableJobs implements Action {
  readonly type = LOADING_AVAILABLE_JOBS;

  constructor(public payload: any) {}
}

export class LoadingAvailableJobsSuccess implements Action {
  readonly type = LOADING_AVAILABLE_JOBS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadingAvailableJobsError implements Action {
  readonly type = LOADING_AVAILABLE_JOBS_ERROR;
  readonly payload;
}

export type Actions
  = LoadingAvailableJobs
  | LoadingAvailableJobsSuccess
  | LoadingAvailableJobsError;
