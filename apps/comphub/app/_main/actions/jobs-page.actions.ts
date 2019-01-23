import { Action } from '@ngrx/store';

import { TrendingJobGroup } from '../models';;

export const GET_TRENDING_JOBS = '[Comphub/Jobs Page] Get Trending Jobs';
export const GET_TRENDING_JOBS_SUCCESS = '[Comphub/Jobs Page] Get Trending Jobs Success';
export const GET_TRENDING_JOBS_ERROR = '[Comphub/Jobs Page] Get Trending Jobs Error';
export const GET_JOB_SEARCH_OPTIONS = '[Comphub/Jobs Page] Get Job Search Autocomplete options';
export const GET_JOB_SEARCH_OPTIONS_SUCCESS = '[Comphub/Jobs Page] Get Job Search Autocomplete options success';
export const GET_JOB_SEARCH_OPTIONS_ERROR = '[Comphub/Jobs Page] Get Job Search Autocomplete options error';
export const SET_SELECTED_JOB = '[Comphub/Jobs Page] Set Selected Job';

export class GetTrendingJobs implements Action {
  readonly type = GET_TRENDING_JOBS;

  constructor() {}
}

export class GetTrendingJobsSuccess implements Action {
  readonly type = GET_TRENDING_JOBS_SUCCESS;

  constructor(public payload: TrendingJobGroup[]) {}
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

export class SetSelectedJob implements Action {
  readonly type = SET_SELECTED_JOB;

  constructor(public payload: string) {}
}

export type Actions
  = GetTrendingJobs
  | GetTrendingJobsSuccess
  | GetTrendingJobsError
  | GetJobSearchOptions
  | GetJobSearchOptionsSuccess
  | GetJobSearchOptionsError
  | SetSelectedJob;
