import { Action } from '@ngrx/store';

import { JobMatchCut } from 'libs/models/payfactors-api';

import { JobToPrice } from '../models';
import { ProjectContext, DataCutDetails } from '../../survey-search/models';

export const GET_JOBS_TO_PRICE = '[Project Add Data/Jobs to Price] Get Jobs To Price';
export const GET_JOBS_TO_PRICE_SUCCESS = '[Project Add Data/Jobs to Price] Get Jobs To Price Success';
export const GET_JOBS_TO_PRICE_ERROR = '[Project Add Data/Jobs to Price] Get Jobs To Price Error';
export const GET_MATCH_JOB_CUTS = '[Project Add Data/Jobs to Price] Get Match Job Cuts';
export const GET_MATCH_JOB_CUTS_SUCCESS = '[Project Add Data/Jobs to Price] Get Match Job Cuts Success';
export const GET_MATCH_JOB_CUTS_ERROR = '[Project Add Data/Jobs to Price] Get Match Job Cuts Error';
export const ADD_DATA_CUTS_TO_JOB_TO_PRICE = '[Project Add Data/Jobs to Price] Add new data Cuts to Job';
export const REMOVE_JOB_CUT = '[Project Add Data/Jobs to Price] Remove Job Cut';
export const CLEAR_ALL_JOBS = '[Project Add Data/Jobs to Price] Remove all Jobs';
export const GET_PRICING_MATCHES = '[Modify Pricings] Get Pricing Matches';


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
export class AddNewDataCuts implements Action {
  readonly type = ADD_DATA_CUTS_TO_JOB_TO_PRICE;

  constructor(public payload: {JobId: number, DataCuts: DataCutDetails[]}) {}
}
export class RemoveJobCut implements Action {
  readonly type = REMOVE_JOB_CUT;

  constructor(public payload: {JobId: number, DataCut: JobMatchCut}) {}
}

export class GetPricingMatches implements Action {
  readonly type = GET_PRICING_MATCHES;
  constructor(public pricingId: number, public rate: string) {}
}

export type JobsToPriceActions
  = GetJobsToPrice
  | GetJobsToPriceSuccess
  | GetJobsToPriceError
  | GetMatchJobCuts
  | GetMatchJobCutsSuccess
  | GetMatchJobCutsError
  | ClearAllJobs
  | AddNewDataCuts
  | RemoveJobCut
  | GetPricingMatches;
