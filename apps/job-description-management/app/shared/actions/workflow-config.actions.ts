import { Action } from '@ngrx/store';

import { WorkflowUser, AddUserToWorkflowObj, WorkflowStep } from '../models';

export const POPULATE_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Populate Workflow';
export const ADD_NON_PF_USER_TO_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Add Non Payfactors User to Workflow';
export const ADD_NON_PF_USER_TO_WORKFLOW_ERROR = '[JobDescriptionManagement/Shared/Workflow Config] Add Non Payfactors User to Workflow Error';
export const CREATE_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Create Workflow Step';
export const UPDATE_WORKFLOW_STEP_PERMISSION = '[JobDescriptionManagement/Shared/Workflow Config] Update Workflow Step Permission';
export const DELETE_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Delete Workflow Step';
export const ADD_USER_TO_WORKFLOW_STEP = '[JobDescriptionManagement/Shared/Workflow Config] Add User To Workflow Step';
export const REORDER_WORKFLOW_STEPS = '[JobDescriptionManagement/Shared/Workflow Config] Reorder Workflow Steps';
export const RESET_WORKFLOW = '[JobDescriptionManagement/Shared/Workflow Config] Reset Workflow';

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

  constructor() {}
}

export class CreateWorkflowStep implements Action {
  readonly type = CREATE_WORKFLOW_STEP;

  constructor(public payload: WorkflowUser) {}
}

export class UpdateWorkflowStepPermission implements Action {
  readonly type = UPDATE_WORKFLOW_STEP_PERMISSION;

  constructor(public payload: { stepIndex: number, permission: string, selected: boolean }) {}
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

  constructor() {}
}

export type WorkflowConfigActions
  = PopulateWorkflow
  | AddNonPfUserToWorkflow
  | AddNonPfUserToWorkflowError
  | CreateWorkflowStep
  | UpdateWorkflowStepPermission
  | DeleteWorkflowStep
  | AddUserToWorkflowStep
  | ReorderWorkflowSteps
  | ResetWorkflow;
