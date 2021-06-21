import { Action } from '@ngrx/store';

import { Workflow } from '../models';

export const CREATE_WORKFLOW = '[job-description-management / Workflow Setup Modal] Create Workflow';
export const CREATE_WORKFLOW_ERROR = '[job-description-management / Workflow Setup Modal] Create Workflow Error';

export class CreateWorkflow implements Action {
  readonly type = CREATE_WORKFLOW;

  constructor(public payload: Workflow[]) {}
}

export class CreateWorkflowError implements Action {
  readonly type = CREATE_WORKFLOW_ERROR;
}

export type Actions
  = CreateWorkflow
  | CreateWorkflowError;
