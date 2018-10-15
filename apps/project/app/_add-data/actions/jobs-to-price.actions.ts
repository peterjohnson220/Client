import { Action } from '@ngrx/store';
import { JobToPrice, ProjectContext } from '../models';

export const GET_JOBS_TO_PRICE = '[Project Add Data/Jobs to Price] Get Jobs To Price';
export const GET_JOBS_TO_PRICE_SUCCESS = '[Project Add Data/Jobs to Price] Get Jobs To Price Success';
export const GET_JOBS_TO_PRICE_ERROR = '[Project Add Data/Jobs to Price] Get Jobs To Price Error';
export const GET_MATCH_JOB_CUTS = '[Project Add Data/Jobs to Price] Get Match Job Cuts';
export const GET_MATCH_JOB_CUTS_SUCCESS = '[Project Add Data/Jobs to Price] Get Match Job Cuts Success';
export const GET_MATCH_JOB_CUTS_ERROR = '[Project Add Data/Jobs to Price] Get Match Job Cuts Error';
export const CLEAR_ALL_JOBS = '[Project Add Data/Jobs to Price] Remove all Jobs';


export class GetJobsToPrice implements Action {
  readonly type = GET_JOBS_TO_PRICE;

  constructor(public payload: ProjectContext) {}
}

export class GetJobsToPriceSuccess implements Action {
  readonly type = GET_JOBS_TO_PRICE_SUCCESS;

  constructor(public payload: JobToPrice[]) {}
}

export class GetJobsToPriceError implements Action {
  readonly type = GET_JOBS_TO_PRICE_ERROR;

  constructor() {}
}

export class GetMatchJobCuts implements Action {
  readonly type = GET_MATCH_JOB_CUTS;

  constructor(public payload: JobToPrice) {}
}

export class GetMatchJobCutsError implements Action {
  readonly type = GET_MATCH_JOB_CUTS_ERROR;

  constructor(public payload: JobToPrice) {}
}

export class GetMatchJobCutsSuccess implements Action {
  readonly type = GET_MATCH_JOB_CUTS_SUCCESS;

  constructor(public payload: any) {}
}

export class ClearAllJobs implements Action {
  readonly type = CLEAR_ALL_JOBS;

  constructor() {}
}

export type Actions
  = GetJobsToPrice
  | GetJobsToPriceSuccess
  | GetJobsToPriceError
  | GetMatchJobCuts
  | GetMatchJobCutsSuccess
  | GetMatchJobCutsError
  | ClearAllJobs;
