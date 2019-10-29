import { Action } from '@ngrx/store';

import { JobMatchResult } from '../models';

export const GET_JOB_MATCHES = '[job-description-management / Job Matches] Get Job Matches';
export const GET_JOB_MATCHES_SUCCESS = '[job-description-management / Job Matches] Get Job Matches Success';
export const GET_JOB_MATCHES_ERROR = '[job-description-management / Job Matches] Get Job Matches Error';

export class GetJobMatches implements Action {
  readonly type = GET_JOB_MATCHES;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class GetJobMatchesSuccess implements Action {
  readonly type = GET_JOB_MATCHES_SUCCESS;

  constructor(public payload: JobMatchResult[]) {}
}

export class GetJobMatchesError implements Action {
  readonly type = GET_JOB_MATCHES_ERROR;

  constructor() {}
}

export type Actions
  = GetJobMatches
  | GetJobMatchesSuccess
  | GetJobMatchesError;

