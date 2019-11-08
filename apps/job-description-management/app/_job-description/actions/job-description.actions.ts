import { Action } from '@ngrx/store';

import {
  CreateJobDescriptionDraftRequest,
  CreateJobDescriptionRequest
} from 'libs/models/payfactors-api/job-description/request';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from 'libs/models/payfactors-api/job-description-template/request';
import { JobDescription, JobDescriptionControl } from 'libs/models';

import { GetJobDescriptionData, SaveJobDescriptionTemplateIdSucessModel, JobDescriptionExtendedInfo } from '../models';

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
export const LOAD_COMPANY_LOGO = '[job-description-management / Job Description] Load Company Logo';
export const LOAD_COMPANY_LOGO_SUCCESS = '[job-description-management / Job Description] Load Company Logo Success';
export const LOAD_COMPANY_LOGO_ERROR = '[job-description-management / Job Description] Load Company Logo Error';
export const UNDO_JOB_DESCRIPTION_CHANGES = '[job-description-management / Job Description] Undo Job Description Changes';
export const PUBLISH_JOB_DESCRIPTION = '[job-description-management / Job Description] Publish Job Description';
export const PUBLISH_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Publish Job Description Success';
export const PUBLISH_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Publish Job Description Error';
export const EDIT_JOB_DESCRIPTION = '[job-description-management / Job Description] Edit Job Description';
export const GET_VIEWS = '[job-description-management / Job Description] Get Views';
export const GET_VIEWS_SUCCESS = '[job-description-management / Job Description] Get Views Success';
export const GET_VIEWS_ERROR = '[job-description-management / Job Description] Get Views Error';
export const DISCARD_DRAFT = '[job-description-management / Job Description] Discard Draft';
export const DISCARD_DRAFT_SUCCESS = '[job-description-management / Job Description] Discard Draft Success';
export const DISCARD_DRAFT_ERROR = '[job-description-management / Job Description] Discard Draft Error';
export const TOGGLE_JOB_DESCRIPTION_FULLSCREEN_STATUS = '[job-description-management / Job Description]  Toggle Job Description Fullscreen Status';
export const GET_JOB_DESCRIPTION_EXTENDED_INFO = '[job-description-management / Job Description]  Get Job Description Extended Info';
export const GET_JOB_DESCRIPTION_EXTENDED_INFO_SUCCESS = '[job-description-management / Job Description]  Get Job Description Extended Info Success';
export const GET_JOB_DESCRIPTION_EXTENDED_INFO_ERROR = '[job-description-management / Job Description]  Get Job Description Extended Info Error';
export const LOAD_JOB_DESCRIPTION_EXTENDED_INFO = '[job-description-management / Job Description]  Load Job Description Extended Info ';
export const ADD_DATA_ROW_TO_CONTROL = '[job-description-management / Job Description] Add Data Row To Control';
export const REMOVE_CONTROL_DATA_ROW = '[job-description-management / Job Description] Remove Control Data Row';
export const REPLACE_CONTROL_DATA = '[job-description-management / Job Description] Replace Control Data';
export const UPDATE_CONTROL_DATA = '[job-description-management / Job Description] Update Control Data';
export const UPDATE_CONTROL_ADDITIONAL_PROPERTIES = '[job-description-management / Job Description] Update Control Additional Properties';
export const REPLACE_JOB_DESCRIPTION_VIA_COPY = '[job-description-management / Job Description] Replace Job Description Via Copy';

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

  constructor(public payload: GetJobDescriptionData) {}
}

export class GetJobDescriptionSuccess implements Action {
  readonly type = GET_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: { jobDescription: JobDescription, requestData: GetJobDescriptionData }) {}
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

export class LoadCompanyLogo implements Action {
  readonly type = LOAD_COMPANY_LOGO;
  constructor(public payload: number) {}
}
export class LoadCompanyLogoSuccess implements Action {
  readonly type = LOAD_COMPANY_LOGO_SUCCESS;
  constructor(public payload: string) {}
}
export class LoadCompanyLogoError implements Action {
  readonly type = LOAD_COMPANY_LOGO_ERROR;
  constructor() {}
}

export class UndoJobDescriptionChanges implements Action {
  readonly type = UNDO_JOB_DESCRIPTION_CHANGES;

  constructor() {}
}

export class PublishJobDescription implements Action {
  readonly type = PUBLISH_JOB_DESCRIPTION;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class PublishJobDescriptionSuccess implements Action {
  readonly type = PUBLISH_JOB_DESCRIPTION_SUCCESS;

  constructor(public payload: JobDescription) {}
}

export class PublishJobDescriptionError implements Action {
  readonly type = PUBLISH_JOB_DESCRIPTION_ERROR;

  constructor() {}
}

export class ToggleJobDescriptionFullscreenStatus implements Action {
  readonly type = TOGGLE_JOB_DESCRIPTION_FULLSCREEN_STATUS;

  constructor() {}
}

export class EditJobDescription implements Action {
  readonly type = EDIT_JOB_DESCRIPTION;

  constructor() {}
}

export class GetViews implements Action {
  readonly type = GET_VIEWS;

  constructor(public payload: { templateId: number }) {}
}

export class GetViewsSuccess implements Action {
  readonly type = GET_VIEWS_SUCCESS;

  constructor(public payload: { views: string[] }) {}
}

export class GetViewsError implements Action {
  readonly type = GET_VIEWS_ERROR;

  constructor() {}
}

  export class GetJobDescriptionExtendedInfo {
  readonly type = GET_JOB_DESCRIPTION_EXTENDED_INFO;

  constructor(public payload: {jobDescriptionId: number, revision: number}) {}
}

export class GetJobDescriptionExtendedInfoSuccess {
  readonly type = GET_JOB_DESCRIPTION_EXTENDED_INFO_SUCCESS;

  constructor() {}
}

export class DiscardDraft implements Action {
  readonly type = DISCARD_DRAFT;

  constructor(public payload: { jobDescriptionId: number, inWorkflow: boolean }) {}
}

export class DiscardDraftSuccess implements Action {
  readonly type = DISCARD_DRAFT_SUCCESS;

  constructor() {}
}

  export class GetJobDescriptionExtendedInfoError {
  readonly type = GET_JOB_DESCRIPTION_EXTENDED_INFO_ERROR;

  constructor() {}
}

export class DiscardDraftError implements Action {
  readonly type = DISCARD_DRAFT_ERROR;

  constructor() {}
}

export class LoadJobDescriptionExtendedInfo {
  readonly type = LOAD_JOB_DESCRIPTION_EXTENDED_INFO;

  constructor(public payload: JobDescriptionExtendedInfo) {}
}

export class AddDataRowToControl implements Action {
  readonly type = ADD_DATA_ROW_TO_CONTROL;

  constructor(public payload: { jobDescriptionControl: JobDescriptionControl, dataRow: any }) {}
}

export class RemoveControlDataRow implements Action {
  readonly type = REMOVE_CONTROL_DATA_ROW;

  constructor(public payload: { jobDescriptionControl: JobDescriptionControl, dataRowId: number }) {}
}

export class ReplaceControlData implements Action {
  readonly type = REPLACE_CONTROL_DATA;

  constructor(public payload: { jobDescriptionControl: JobDescriptionControl, dataRows: any }) {}
}

export class UpdateControlData implements Action {
  readonly type = UPDATE_CONTROL_DATA;

  constructor(public payload: { changeObj: any }) {}
}

export class UpdateControlAdditionalProperties implements Action {
  readonly type = UPDATE_CONTROL_ADDITIONAL_PROPERTIES;

  constructor(public payload: { jobDescriptionControl: JobDescriptionControl, additionalProperties: any }) {}
}

export class ReplaceJobDescriptionViaCopy implements Action {
  readonly type = REPLACE_JOB_DESCRIPTION_VIA_COPY;

  constructor(public payload: JobDescription) {}
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
  | TogglePublishButton
  | LoadCompanyLogo
  | LoadCompanyLogoSuccess
  | LoadCompanyLogoError
  | UndoJobDescriptionChanges
  | PublishJobDescription
  | PublishJobDescriptionSuccess
  | PublishJobDescriptionError
  | EditJobDescription
  | GetViews
  | GetViewsSuccess
  | GetViewsError
  | DiscardDraft
  | DiscardDraftSuccess
  | DiscardDraftError
  | ToggleJobDescriptionFullscreenStatus
  | GetJobDescriptionExtendedInfo
  | GetJobDescriptionExtendedInfoSuccess
  | GetJobDescriptionExtendedInfoError
  | LoadJobDescriptionExtendedInfo
  | AddDataRowToControl
  | RemoveControlDataRow
  | ReplaceControlData
  | UpdateControlData
  | UpdateControlAdditionalProperties
  | ReplaceJobDescriptionViaCopy;
