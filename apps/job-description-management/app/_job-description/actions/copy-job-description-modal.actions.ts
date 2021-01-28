import { Action } from '@ngrx/store';

import { JobDescription } from 'libs/models';

import { JobDescriptionSource } from 'libs/features/jobs/job-description-management/models';

export const GET_JOB_DESCRIPTION_SOURCES = '[job-description-management / Copy Job Description Modal] Get Job Description Sources';
export const GET_JOB_DESCRIPTION_SOURCES_SUCCESS = '[job-description-management / Copy Job Description Modal] Get Job Description Sources Success';
export const GET_JOB_DESCRIPTION_SOURCES_ERROR = '[job-description-management / Copy Job Description Modal] Get Job Description Sources Error';
export const REPLACE_JOB_DESCRIPTION = '[job-description-management / Copy Job Description Modal] Replace Job Description';
export const REPLACE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Copy Job Description Modal] Replace Job Description Success';
export const REPLACE_JOB_DESCRIPTION_ERROR = '[job-description-management / Copy Job Description Modal] Replace Job Description Error';

export class GetJobDescriptionSources implements Action {
  readonly type = GET_JOB_DESCRIPTION_SOURCES;

  constructor(public payload: { jobDescriptionId: number, templateId: number, jobFamily: string }) {}
}

export class GetJobDescriptionSourcesSuccess implements Action {
  readonly type = GET_JOB_DESCRIPTION_SOURCES_SUCCESS;

  constructor(public payload: JobDescriptionSource[]) {}
}

export class GetJobDescriptionSourcesError implements Action {
  readonly type = GET_JOB_DESCRIPTION_SOURCES_ERROR;

  constructor() {}
}

export class ReplaceJobDescription implements Action {
  readonly type = REPLACE_JOB_DESCRIPTION;

  constructor(public payload: { jobDescriptionId: number, jobDescriptionIdToCopyFrom: number, jobDescriptionStatus: string }) {}
}

export class ReplaceJobDescriptionSuccess implements Action {
  readonly type = REPLACE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: JobDescription) {}
}

export class ReplaceJobDescriptionError implements Action {
  readonly type = REPLACE_JOB_DESCRIPTION_SUCCESS;

  constructor() {}
}

export type Actions
  = GetJobDescriptionSources
  | GetJobDescriptionSourcesSuccess
  | GetJobDescriptionSourcesError
  | ReplaceJobDescription
  | ReplaceJobDescriptionSuccess
  | ReplaceJobDescriptionError;
