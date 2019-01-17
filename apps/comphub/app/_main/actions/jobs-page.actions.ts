import { Action } from '@ngrx/store';

import { TrendingJob } from '../models/trending-job.model';

export const GET_TRENDING_JOBS = '[Comphub/Jobs Page] Get Trending Jobs';
export const GET_TRENDING_JOBS_SUCCESS = '[Comphub/Jobs Page] Get Trending Jobs Success';
export const GET_TRENDING_JOBS_ERROR = '[Comphub/Jobs Page] Get Trending Jobs Error';
export const GET_JOB_SEARCH_OPTIONS = '[Comphub/Jobs Page] Get Job Search Autocomplete options';
export const GET_JOB_SEARCH_OPTIONS_SUCCESS = '[Comphub/Jobs Page] Get Job Search Autocomplete options success';
export const GET_JOB_SEARCH_OPTIONS_ERROR = '[Comphub/Jobs Page] Get Job Search Autocomplete options error';

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

export class GetJobSearchOptions implements Action {
  readonly type = GET_JOB_SEARCH_OPTIONS;

  constructor(public payload: string) {}
}

export class GetJobSearchOptionsSuccess implements Action {
  readonly type = GET_JOB_SEARCH_OPTIONS_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetJobSearchOptionsError implements Action {
  readonly type = GET_JOB_SEARCH_OPTIONS_ERROR;

  constructor() {}
}

export type Actions
  = GetTrendingJobs
  | GetTrendingJobsSuccess
  | GetTrendingJobsError
  | GetJobSearchOptions
  | GetJobSearchOptionsSuccess
  | GetJobSearchOptionsError;
