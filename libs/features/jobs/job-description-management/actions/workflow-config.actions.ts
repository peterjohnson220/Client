import { Action } from '@ngrx/store';
import { JobDescriptionWorkflowAttachment } from 'libs/models/jdm/job-description-workflow-attachment';
import { WorkflowUser, AddUserToWorkflowObj, WorkflowStep } from '../models';

export const POPULATE_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Populate Workflow';
export const ADD_NON_PF_USER_TO_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Add Non Payfactors User to Workflow';
export const ADD_NON_PF_USER_TO_WORKFLOW_ERROR = '[JobDescriptionManagement/Shared/Workflow Config] Add Non Payfactors User to Workflow Error';
export const ADD_SELECTED_USER_OR_EMAIL = '[JobDescriptionManagement/Shared/Workflow Config] Add Selected User or Email';
export const DELETE_USER_OR_EMAIL = '[JobDescriptionManagement/Shared/Workflow Config] Delete User or Email';
export const CREATE_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Create Workflow Step';
export const UPDATE_WORKFLOW_STEP_PERMISSION = '[JobDescriptionManagement/Shared/Workflow Config] Update Workflow Step Permission';
export const DELETE_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Delete Workflow Step';
export const ADD_USER_TO_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Add User To Workflow Step';
export const REORDER_WORKFLOW_STEPS = '[JobDescriptionManagement/Shared/Workflow Config] Reorder Workflow Steps';
export const RESET_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Reset Workflow';
export const SAVE_WORKFLOW_ATTACHMENTS_STATE = '[JobDescriptionManagement/Shared/Workflow Config] Save Workflow Attachments State';
export const DELETE_WORKFLOW_ATTACHMENT_FILES = '[JobDescriptionManagement/Shared/Workflow Config] Delete Workflow Attachment Files';
export const DELETE_WORKFLOW_ATTACHMENT_FILES_SUCCESS = '[JobDescriptionManagement/Shared/Workflow Config] Delete Workflow Attachment Files Success';
export const DELETE_WORKFLOW_ATTACHMENT_FILES_ERROR = '[JobDescriptionManagement/Shared/Workflow Config] Delete Workflow Attachment Files Error';

export class PopulateWorkflow implements Action {
  readonly type = POPULATE_WORKFLOW;

  constructor(public payload: { workflowSteps: WorkflowStep[], prepopulating: boolean }) {}
}

export class AddNonPfUserToWorkflow implements Action {
  readonly type = ADD_NON_PF_USER_TO_WORKFLOW;

  constructor(public payload: AddUserToWorkflowObj) {}
}

export class AddNonPfUserToWorkflowError implements Action {
  readonly type = ADD_NON_PF_USER_TO_WORKFLOW_ERROR;
}

export class AddSelectedUserOrEmail implements Action {
  readonly type = ADD_SELECTED_USER_OR_EMAIL;

  constructor(public payload: WorkflowUser) {}
}

export class DeleteUserOrEmail implements Action {
  readonly type = DELETE_USER_OR_EMAIL;

  constructor(public payload: WorkflowUser) {}
}

export class CreateWorkflowStep implements Action {
  readonly type = CREATE_WORKFLOW_STEP;

  constructor(public payload: WorkflowUser) {}
}

export class UpdateWorkflowStepPermission implements Action {
  readonly type = UPDATE_WORKFLOW_STEP_PERMISSION;

  constructor(public payload: { workflowUser: WorkflowUser, permission: string}) {}
}

export class DeleteWorkflowStep implements Action {
  readonly type = DELETE_WORKFLOW_STEP;

  constructor(public payload: { stepIndex: number }) {}
}

export class AddUserToWorkflowStep implements Action {
  readonly type = ADD_USER_TO_WORKFLOW_STEP;

  constructor(public payload: { stepIndex: number, workflowUser: WorkflowUser }) {}
}

export class ReorderWorkflowSteps implements Action {
  readonly type = REORDER_WORKFLOW_STEPS;

  constructor(public payload: WorkflowStep[]) {}
}

export class ResetWorkflow implements Action {
  readonly type = RESET_WORKFLOW;
}

export class SaveWorkflowAttachmentsState implements Action {
  readonly type = SAVE_WORKFLOW_ATTACHMENTS_STATE;
  constructor(public payload: JobDescriptionWorkflowAttachment[]) {}
}

export class DeleteWorkflowAttachmentFiles implements Action {
  readonly type = DELETE_WORKFLOW_ATTACHMENT_FILES;
  constructor(public payload: string[]) {
  }
}

export class DeleteWorkflowAttachmentFilesSuccess implements Action {
  readonly type = DELETE_WORKFLOW_ATTACHMENT_FILES_SUCCESS;
}

export class DeleteWorkflowAttachmentFilesError implements Action {
  readonly type = DELETE_WORKFLOW_ATTACHMENT_FILES_ERROR;
}

export type WorkflowConfigActions
  = PopulateWorkflow
  | AddNonPfUserToWorkflow
  | AddNonPfUserToWorkflowError
  | AddSelectedUserOrEmail
  | DeleteUserOrEmail
  | CreateWorkflowStep
  | UpdateWorkflowStepPermission
  | DeleteWorkflowStep
  | AddUserToWorkflowStep
  | ReorderWorkflowSteps
  | ResetWorkflow
  | SaveWorkflowAttachmentsState
  | DeleteWorkflowAttachmentFiles
  | DeleteWorkflowAttachmentFilesSuccess
  | DeleteWorkflowAttachmentFilesError;
