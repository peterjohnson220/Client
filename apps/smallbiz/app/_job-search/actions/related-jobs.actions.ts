import { Action } from '@ngrx/store';
import { Job } from '../models/job';

export const LOAD_RELATED_JOBS = '[RELATED JOBS] LoadRelatedJobs';
export const LOAD_RELATED_JOBS_SUCCESS = '[RELATED JOBS] LoadRelatedJobsSuccess';
export const LOAD_RELATED_JOBS_FAILURE = '[RELATED JOBS] LoadRelatedJobsFailure';

export class LoadRelatedJobs implements Action {
  readonly type = LOAD_RELATED_JOBS;
  constructor(public payload: { jobId: number }) { }
}

export class LoadRelatedJobsSuccess implements Action {
  readonly type = LOAD_RELATED_JOBS_SUCCESS;
  constructor(public payload: { relatedJobs: Job[] }) { }
}

export class LoadRelatedJobsFailure implements Action {
  readonly type = LOAD_RELATED_JOBS_FAILURE;
  constructor(public payload: any) { }
}

export type RelatedJobsAction =
  LoadRelatedJobs |
  LoadRelatedJobsSuccess |
  LoadRelatedJobsFailure;
