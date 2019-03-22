import { Action } from '@ngrx/store';

import { TrendingJobGroup } from '../models';

export const GET_TRENDING_JOBS = '[Comphub/Jobs Card] Get Trending Jobs';
export const GET_TRENDING_JOBS_SUCCESS = '[Comphub/Jobs Card] Get Trending Jobs Success';
export const GET_TRENDING_JOBS_ERROR = '[Comphub/Jobs Card] Get Trending Jobs Error';
export const GET_JOB_SEARCH_OPTIONS = '[Comphub/Jobs Card] Get Job Search Autocomplete Options';
export const GET_JOB_SEARCH_OPTIONS_SUCCESS = '[Comphub/Jobs Card] Get Job Search Autocomplete Options Success';
export const GET_JOB_SEARCH_OPTIONS_ERROR = '[Comphub/Jobs Card] Get Job Search Autocomplete Options Error';
export const CLEAR_JOB_SEARCH_OPTIONS = '[Comphub/Jobs Card] Clear Job Search Options';
export const SET_SELECTED_JOB = '[Comphub/Jobs Card] Set Selected Job';
export const CLEAR_SELECTED_JOB = '[Comphub/Jobs Card] Clear Selected Job';

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

export class ClearJobSearchOptions implements Action {
  readonly type = CLEAR_JOB_SEARCH_OPTIONS;

  constructor() {}
}

export class SetSelectedJob implements Action {
  readonly type = SET_SELECTED_JOB;

  constructor(public payload: { jobTitle: string, navigateToNextCard?: boolean }) {}
}

export class ClearSelectedJob implements Action {
  readonly type = CLEAR_SELECTED_JOB;

  constructor() {}
}

export type Actions
  = GetTrendingJobs
  | GetTrendingJobsSuccess
  | GetTrendingJobsError
  | GetJobSearchOptions
  | GetJobSearchOptionsSuccess
  | GetJobSearchOptionsError
  | ClearJobSearchOptions
  | SetSelectedJob
  | ClearSelectedJob;
