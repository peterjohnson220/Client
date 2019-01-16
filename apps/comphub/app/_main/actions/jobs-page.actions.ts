import { Action } from '@ngrx/store';

import { TrendingJob } from '../models/trending-job.model';

export const GET_TRENDING_JOBS = '[Comphub/Jobs Page] Get Trending Jobs';
export const GET_TRENDING_JOBS_SUCCESS = '[Comphub/Jobs Page] Get Trending Jobs Success';
export const GET_TRENDING_JOBS_ERROR = '[Comphub/Jobs Page] Get Trending Jobs Error';

export class GetTrendingJobs implements Action {
  readonly type = GET_TRENDING_JOBS;

  constructor() {}
}

export class GetTrendingJobsSuccess implements Action {
  readonly type = GET_TRENDING_JOBS_SUCCESS;

  constructor(public payload: TrendingJob[]) {}
}

export class GetTrendingJobsError implements Action {
  readonly type = GET_TRENDING_JOBS_ERROR;

  constructor() {}
}

export type Actions
  = GetTrendingJobs
  | GetTrendingJobsSuccess
  | GetTrendingJobsError;
