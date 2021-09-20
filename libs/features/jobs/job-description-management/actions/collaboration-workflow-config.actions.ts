import { Action } from '@ngrx/store';

import { WorkflowUser, AddUserToWorkflowObj } from '../models';

export const SELECT_COLLABORATION_WORKFLOW_USER_OR_EMAIL = '[JobDescriptionManagement/Shared/Collaboration Config] Select Collaboration Workflow User or Email';
export const ADD_NON_PF_USER_TO_COLLABORATION_WORKFLOW = '[JobDescriptionManagement/Shared/Collaboration Config] Add Non Payfactors User to Collaboration Workflow';
export const ADD_NON_PF_USER_TO_COLLABORATION_WORKFLOW_ERROR = '[JobDescriptionManagement/Shared/Collaboration Config] Add Non Payfactors User to Collaboration Workflow Error';
export const ADD_SELECTED_USER_OR_EMAIL_TO_COLLABORATION_WORKFLOW = '[JobDescriptionManagement/Shared/Collaboration Config] Add Selected User or Email to Collaboration Workflow';
export const DELETE_USER_OR_EMAIL_FROM_COLLABORATION_WORKFLOW = '[JobDescriptionManagement/Shared/Collaboration Config] Delete User or Email from Collaboration Workflow';
export const RESET_COLLABORATION_WORKFLOW = '[JobDescriptionManagement/Shared/Collaboration Config] Reset Collaboration Workflow';

export class SelectCollaborationWorkflowUserOrEmail implements Action {
  readonly type = SELECT_COLLABORATION_WORKFLOW_USER_OR_EMAIL;

  constructor(public payload: WorkflowUser) {}
}

export class AddNonPfUserToCollaborationWorkflow implements Action {
  readonly type = ADD_NON_PF_USER_TO_COLLABORATION_WORKFLOW;

  constructor(public payload: AddUserToWorkflowObj) {}
}

export class AddNonPfUserToCollaborationWorkflowError implements Action {
  readonly type = ADD_NON_PF_USER_TO_COLLABORATION_WORKFLOW_ERROR;
}

export class AddSelectedUserOrEmailToCollaborationWorkflow implements Action {
  readonly type = ADD_SELECTED_USER_OR_EMAIL_TO_COLLABORATION_WORKFLOW;

  constructor(public payload: WorkflowUser) {}
}

export class DeleteUserOrEmailFromCollaborationWorkflow implements Action {
  readonly type = DELETE_USER_OR_EMAIL_FROM_COLLABORATION_WORKFLOW;

  constructor(public payload: WorkflowUser) {}
}

export class ResetCollaborationWorkflow implements Action {
  readonly type = RESET_COLLABORATION_WORKFLOW;
}

export type CollaborationWorkflowConfigActions
  = SelectCollaborationWorkflowUserOrEmail
  | AddNonPfUserToCollaborationWorkflow
  | AddNonPfUserToCollaborationWorkflowError
  | AddSelectedUserOrEmailToCollaborationWorkflow
  | DeleteUserOrEmailFromCollaborationWorkflow
  | ResetCollaborationWorkflow;
