import { Action } from '@ngrx/store';

import { Workflow } from '../models';

export const CREATE_WORKFLOW = '[job-description-management / Workflow Setup Modal] Create Workflow';
export const CREATE_WORKFLOW_SUCCESS = '[job-description-management / Workflow Setup Modal] Create Workflow Success';
export const CREATE_WORKFLOW_ERROR = '[job-description-management / Workflow Setup Modal] Create Workflow Error';

export class CreateWorkflow implements Action {
  readonly type = CREATE_WORKFLOW;

  constructor(public payload: Workflow) {}
}

export class CreateWorkflowSuccess implements Action {
  readonly type = CREATE_WORKFLOW_SUCCESS;

  constructor() {}
}

export class CreateWorkflowError implements Action {
  readonly type = CREATE_WORKFLOW_ERROR;

  constructor() {}
}

export type Actions
  = CreateWorkflow
  | CreateWorkflowSuccess
  | CreateWorkflowError;
