import { Action } from '@ngrx/store';
import { Job } from '../models/job';

export const LOAD_JOB = '[JOB DETAIL] LoadJob';
export const LOAD_JOB_SUCCESS = '[JOB DETAIL] LoadJobSuccess';
export const LOAD_JOB_FAILURE = '[JOB DETAIL] LoadJobFailure';

export class LoadJob implements Action {
  readonly type = LOAD_JOB;
  constructor(public payload: { id: number }) { }
}

export class LoadJobSuccess implements Action {
  readonly type = LOAD_JOB_SUCCESS;
  constructor(public payload: { job: Job }) { }
}

export class LoadJobFailure implements Action {
  readonly type = LOAD_JOB_FAILURE;
  constructor(public error: any) { }
}

export type JobDetailAction = LoadJob | LoadJobSuccess | LoadJobFailure;
