import { Action } from '@ngrx/store';

import { SaveJobDescriptionTemplateIdSucessModel, CompanyJobViewListItem, JobDescriptionDraftDetails } from '../models';
import { JobDescriptionAppliesTo } from '../../shared/models';

export const CREATE_JOB_DESCRIPTION = '[job-description-management / Job Description List] Create Job Description';
export const CREATE_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description List] Create Job Description Error';
export const CREATE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description List] Create Job Description Success';
export const CREATE_JOB_DESCRIPTION_DRAFT = '[job-description-management / Job Description List] Create Job Description Draft';
export const CREATE_JOB_DESCRIPTION_DRAFT_ERROR = '[job-description-management / Job Description List] Create Job Description Draft Error';
export const CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS = '[job-description-management / Job Description List] Create Job Description Draft Success';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID =
  '[job-description-management / Job Description List] Save Company Jobs Job Description Template Id';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR =
  '[job-description-management / Job Description List] Save Company Jobs Job Description Template Id Error';
export const SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS =
  '[job-description-management / Job Description List] Save Company Jobs Job Description Template Id Success';

export class CreateJobDescription implements Action {
  readonly type = CREATE_JOB_DESCRIPTION;

  constructor(public payload: { companyJobViewListItem: CompanyJobViewListItem, appliesTo?: JobDescriptionAppliesTo }) {}
}

export class CreateJobDescriptionError implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_ERROR;
}

export class CreateJobDescriptionSuccess implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class CreateJobDescriptionDraft implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT;

  constructor(public payload: CompanyJobViewListItem) {}
}

export class CreateJobDescriptionDraftError implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT_ERROR;
}

export class CreateJobDescriptionDraftSuccess implements Action {
  readonly type = CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS;

  constructor(public payload: JobDescriptionDraftDetails) {}
}

export class SaveCompanyJobsJobDescriptionTemplateId implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID;

  constructor(public payload: { companyJobIdsToAssign: number[], passThroughParameters: any } ) {}
}

export class SaveCompanyJobsJobDescriptionTemplateIdError implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_ERROR;

  constructor(public payload: any) {}
}

export class SaveCompanyJobsJobDescriptionTemplateIdSuccess implements Action {
  readonly type = SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS;

  constructor(public payload: SaveJobDescriptionTemplateIdSucessModel) {}
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
  | SaveCompanyJobsJobDescriptionTemplateIdSuccess;
