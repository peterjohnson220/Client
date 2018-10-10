import { Action } from '@ngrx/store';
import { JobToPrice, ProjectContext } from '../models';

export const GET_JOBS_TO_PRICE = '[Project Add Data/Jobs to Price] Get Jobs To Price';
export const GET_JOBS_TO_PRICE_SUCCESS = '[Project Add Data/Jobs to Price] Get Jobs To Price Success';
export const GET_JOBS_TO_PRICE_ERROR = '[Project Add Data/Jobs to Price] Get Jobs To Price Error';


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

export type Actions
  = GetJobsToPrice
  | GetJobsToPriceSuccess
  | GetJobsToPriceError;
