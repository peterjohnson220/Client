import { Action } from '@ngrx/store';

import {
  CreateJobDescriptionDraftRequest,
  CreateJobDescriptionRequest
} from 'libs/models/payfactors-api/job-description/request';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from 'libs/models/payfactors-api/job-description-template/request';
import { JobDescription } from 'libs/models';

import { SaveJobDescriptionTemplateIdSucessModel } from '../models/save-job-description-template-id-sucess.model';

export const CREATE_JOB_DESCRIPTION = '[job-description-management / Job Description] Create Job Description';
export const CREATE_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Create Job Description Error';
export const CREATE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Create Job Description Success';
export const CREATE_JOB_DESCRIPTION_DRAFT = '[job-description-management / Job Description] Create Job Description Draft';
export const CREATE_JOB_DESCRIPTION_DRAFT_ERROR = '[job-description-management / Job Description] Create Job Description Draft Error';
export const CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS = '[job-description-management / Job Description] Create Job Description Draft Success';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID =
  '[job-description-management / Job Description] Save Company Jobs Job Description Template Id';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR =
  '[job-description-management / Job Description] Save Company Jobs Job Description Template Id Error';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS =
  '[job-description-management / Job Description] Save Company Jobs Job Description Template Id Success';

export const GET_JOB_DESCRIPTION = '[job-description-management / Job Description] Get Job Description';
export const GET_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Get Job Description Success';
export const GET_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Get Job Description Error';
export const SAVE_JOB_DESCRIPTION = '[job-description-management / Job Description] Save Job Description';
export const SAVE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Save Job Description Success';
export const SAVE_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Save Job Description Error';
export const TOGGLE_PUBLISH_BUTTON = '[job-description-management / Job Description] Toggle Publish Button';

export class CreateJobDescription implements Action {
  readonly type = CREATE_JOB_DESCRIPTION;

  constructor(public payload: CreateJobDescriptionRequest) {}
}

export class CreateJobDescriptionError implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_ERROR;
}

export class CreateJobDescriptionSuccess implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: number) {}
}

export class CreateJobDescriptionDraft implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT;

  constructor(public payload: { JobDescriptionId: number, Request: CreateJobDescriptionDraftRequest }) {}
}

export class CreateJobDescriptionDraftError implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT_ERROR;
}

export class CreateJobDescriptionDraftSuccess implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS;

  constructor(public payload: any) {}
}

export class SaveCompanyJobsJobDescriptionTemplateId implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID;

  constructor(public payload: { Request: SaveCompanyJobsJobDescriptionTemplateIdRequest, PassThroughParameters: any } ) {}
}

export class SaveCompanyJobsJobDescriptionTemplateIdError implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR;
}

export class SaveCompanyJobsJobDescriptionTemplateIdSuccess implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS;

  constructor(public payload: SaveJobDescriptionTemplateIdSucessModel) {}
}

export class GetJobDescription implements Action {
  readonly type = GET_JOB_DESCRIPTION;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class GetJobDescriptionSuccess implements Action {
  readonly type = GET_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: JobDescription) {}
}

export class GetJobDescriptionError implements Action {
  readonly type = GET_JOB_DESCRIPTION_ERROR;

  constructor() {}
}

export class SaveJobDescription implements Action {
  readonly type = SAVE_JOB_DESCRIPTION;

  constructor(public payload: { jobDescription: JobDescription, isFirstSave: boolean, undo: boolean }) {}
}

export class SaveJobDescriptionSuccess implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: { jobDescription: JobDescription, isFirstSave: boolean, undo: boolean }) {}
}

export class SaveJobDescriptionError implements Action {
  readonly type = SAVE_JOB_DESCRIPTION_ERROR;

  constructor() {}
}

export class TogglePublishButton implements Action {
  readonly type = TOGGLE_PUBLISH_BUTTON;

  constructor(public payload: { enabled: boolean }) {}
}

export type Actions
  = CreateJobDescription
  | CreateJobDescriptionError
  | CreateJobDescriptionSuccess
  | CreateJobDescriptionDraft
  | CreateJobDescriptionDraftError
  | CreateJobDescriptionDraftSuccess
  | SaveCompanyJobsJobDescriptionTemplateId
  | SaveCompanyJobsJobDescriptionTemplateIdError
  | SaveCompanyJobsJobDescriptionTemplateIdSuccess
  | GetJobDescription
  | GetJobDescriptionSuccess
  | GetJobDescriptionError
  | SaveJobDescription
  | SaveJobDescriptionSuccess
  | SaveJobDescriptionError
  | TogglePublishButton;
