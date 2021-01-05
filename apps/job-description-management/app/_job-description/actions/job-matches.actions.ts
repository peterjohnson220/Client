import { Action } from '@ngrx/store';

import { JobMatchResult } from 'libs/features/jobs/job-description-management/models';

export const GET_JOB_MATCHES = '[job-description-management / Job Matches] Get Job Matches';
export const GET_JOB_MATCHES_SUCCESS = '[job-description-management / Job Matches] Get Job Matches Success';
export const GET_JOB_MATCHES_ERROR = '[job-description-management / Job Matches] Get Job Matches Error';
export const GET_JOB_MATCHES_FORBIDDEN = '[job-description-management / Job Matches] Get Job Matches Forbidden';
export const TOGGLE_JOB_MATCH_SELECTED = '[job-description-management / Job Matches] Toggle Job Match Selected';
export const RESET_JOB_MATCHES = '[job-description-management / Job Matches] Reset Job Matches';
export const CREATE_PROJECT = '[job-description-management / Job Matches] Create Project';
export const CREATE_PROJECT_SUCCESS = '[job-description-management / Job Matches] Create Project Success';
export const CREATE_PROJECT_ERROR = '[job-description-management / Job Matches] Create Project Error';

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

export class GetJobMatchesForbidden implements Action {
  readonly type = GET_JOB_MATCHES_FORBIDDEN;

  constructor() {}
}

export class ToggleJobMatchSelected implements Action {
  readonly type = TOGGLE_JOB_MATCH_SELECTED;

  constructor(public payload: { jobMatchResultId: number }) {}
}

export class ResetJobMatches implements Action {
  readonly type = RESET_JOB_MATCHES;

  constructor() {}
}

export class CreateProject implements Action {
  readonly type = CREATE_PROJECT;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class CreateProjectSuccess implements Action {
  readonly type = CREATE_PROJECT_SUCCESS;

  constructor(public payload: { userSessionId: string }) {}
}

export class CreateProjectError implements Action {
  readonly type = CREATE_PROJECT_ERROR;

  constructor() {}
}

export type Actions
  = GetJobMatches
  | GetJobMatchesSuccess
  | GetJobMatchesError
  | GetJobMatchesForbidden
  | ToggleJobMatchSelected
  | ResetJobMatches
  | CreateProject
  | CreateProjectSuccess
  | CreateProjectError;

