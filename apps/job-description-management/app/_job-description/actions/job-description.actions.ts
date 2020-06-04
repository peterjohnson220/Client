import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { CompanyDto, ControlType, JobDescription, JobDescriptionControl } from 'libs/models';

import {
  GetJobDescriptionData,
  JobDescriptionExtendedInfo,
  ReorderControlDataDto,
  JobDescriptionLibraryDropModel
} from '../models';
import { JobDescriptionAppliesTo } from '../../shared';

export const GET_JOB_DESCRIPTION = '[job-description-management / Job Description] Get Job Description';
export const GET_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Get Job Description Success';
export const GET_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Get Job Description Error';
export const CLEAR_JOB_DESCRIPTION = '[job-description-management / Job Description] Clear Job Description';
export const SAVE_JOB_DESCRIPTION = '[job-description-management / Job Description] Save Job Description';
export const SAVE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Save Job Description Success';
export const SAVE_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Save Job Description Error';
export const TOGGLE_PUBLISH_BUTTON = '[job-description-management / Job Description] Toggle Publish Button';
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
export const RESET_REPLACE_JOB_DESCRIPTION_VIA_COPY = '[job-description-management / Job Description] Reset Replace Job Description Via Copy';
export const REORDER_CONTROL_DATA = '[job-description-management / Job Description] Reorder Control Data';
export const ADD_SOURCE_DATA_TO_CONTROL = '[job-description-management / Job Description] Add Source Data to Control';
export const DELETE_JOB_DESCRIPTION = '[job-description-management / Job Description] Delete Job Description';
export const DELETE_JOB_DESCRIPTION_SUCCESS = '[job-description-management / Job Description] Delete Job Description Success';
export const DELETE_JOB_DESCRIPTION_ERROR = '[job-description-management / Job Description] Delete Job Description Error';
export const UPDATE_JOB_DESCRIPTION_APPLIES_TO = '[job-description-management / Job Description Applies To] Update Job Description Applies To Values';
export const SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED = '[job-description-management / Job Description Page] Set Workflow User Step To Is Being Viewed';
export const SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED_SUCCESS =
  '[job-description-management / Job Description Page] Set Workflow User Step To Is Being Viewed Success';
export const SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED_ERROR =
  '[job-description-management / Job Description Page] Set Workflow User Step To Is Being Viewed Error';

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

  constructor(public payload: HttpErrorResponse) {}
}

export class ClearJobDescription implements Action {
  readonly type = CLEAR_JOB_DESCRIPTION;
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

  constructor(public payload: { jobDescriptionControl: JobDescriptionControl, dataRow: any, save: boolean }) {}
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

export class ResetReplaceJobDescriptionViaCopy implements Action {
  readonly type = RESET_REPLACE_JOB_DESCRIPTION_VIA_COPY;
}

export class ReorderControlData implements Action {
  readonly type = REORDER_CONTROL_DATA;

  constructor(public payload: ReorderControlDataDto) {}
}

export class AddSourceDataToControl implements Action {
  readonly type = ADD_SOURCE_DATA_TO_CONTROL;

  constructor(public payload: { dropModel: JobDescriptionLibraryDropModel, controlTypes: ControlType[]}) {}
}

export class DeleteJobDescription implements Action {
  readonly type = DELETE_JOB_DESCRIPTION;

  constructor(public payload: { jobDescriptionId: number }) {}
}

export class DeleteJobDescriptionSuccess implements Action {
  readonly type = DELETE_JOB_DESCRIPTION_SUCCESS;
}

export class DeleteJobDescriptionError implements Action {
  readonly type = DELETE_JOB_DESCRIPTION_ERROR;
}

export class UpdateJobDescriptionAppliesToValues implements Action {
  readonly type = UPDATE_JOB_DESCRIPTION_APPLIES_TO;

  constructor(public payload: JobDescriptionAppliesTo) {}
}

export class SetWorkflowUserStepToIsBeingViewed implements Action {
  readonly type = SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED;

  constructor(public payload: { jwt: string, isBeingViewed: boolean  }) {}
}

export class SetWorkflowUserStepToIsBeingViewedSuccess implements Action {
  readonly type = SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED_SUCCESS;

  constructor(public payload) {}
}

export class SetWorkflowUserStepToIsBeingViewedError implements Action {
  readonly type = SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED_ERROR;
}

export type Actions
  = GetJobDescription
  | GetJobDescriptionSuccess
  | GetJobDescriptionError
  | ClearJobDescription
  | SaveJobDescription
  | SaveJobDescriptionSuccess
  | SaveJobDescriptionError
  | TogglePublishButton
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
  | ReplaceJobDescriptionViaCopy
  | ResetReplaceJobDescriptionViaCopy
  | ReorderControlData
  | AddSourceDataToControl
  | DeleteJobDescription
  | DeleteJobDescriptionSuccess
  | DeleteJobDescriptionError
  | UpdateJobDescriptionAppliesToValues
  | SetWorkflowUserStepToIsBeingViewed
  | SetWorkflowUserStepToIsBeingViewedSuccess
  | SetWorkflowUserStepToIsBeingViewedError;
