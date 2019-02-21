import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_JOBS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs';
export const LOAD_EXCHANGE_JOBS_SUCCESS  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Success';
export const LOAD_EXCHANGE_JOBS_ERROR  = '[Peer Job Association Modal/Exchange Jobs] Load Exchange Jobs Error';

export class LoadExchangeJobs implements Action {
  readonly type = LOAD_EXCHANGE_JOBS;
}

export class LoadExchangeJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_SUCCESS;
  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobsError implements Action {
  readonly type = LOAD_EXCHANGE_JOBS_ERROR;
}

export type Actions
  = LoadExchangeJobs
  | LoadExchangeJobsSuccess
  | LoadExchangeJobsError;
