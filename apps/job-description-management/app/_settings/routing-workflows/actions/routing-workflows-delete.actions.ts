import { Action } from '@ngrx/store';

import { WorkflowTemplate } from '../../../shared';

export const DELETE_WORKFLOW_TEMPLATE = '[Settings/WorkflowTemplateList] Delete Workflow Template from List';
export const DELETE_WORKFLOW_TEMPLATE_SUCCESS = '[Settings/WorkflowTemplateList] Delete Workflow Template from List Success';
export const DELETE_WORKFLOW_TEMPLATE_ERROR = '[Settings/WorkflowTemplateList] Delete Workflow Template from List Error';
export const OPEN_DELETE_WORKFLOW_TEMPLATE_MODAL = '[Settings/WorkflowTemplateList] Open Delete Workflow Template Modal';
export const CLOSE_DELETE_WORKFLOW_TEMPLATE_MODAL = '[Settings/WorkflowTemplateList] Close Delete Workflow Template Modal';

export class DeleteWorkflowTemplate implements Action {
    readonly type = DELETE_WORKFLOW_TEMPLATE;

    constructor(public payload: {templateId: string}) {}
}

export class DeleteWorkflowTemplateSuccess implements Action {
    readonly type = DELETE_WORKFLOW_TEMPLATE_SUCCESS;
}

export class DeleteWorkflowTemplateError implements Action {
    readonly type = DELETE_WORKFLOW_TEMPLATE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class OpenDeleteWorkflowTemplateModal implements Action {
  readonly type = OPEN_DELETE_WORKFLOW_TEMPLATE_MODAL;

  constructor(public payload: WorkflowTemplate) {}
}

export class CloseDeleteWorkflowTemplateModal implements Action {
  readonly type = CLOSE_DELETE_WORKFLOW_TEMPLATE_MODAL;
}

export type DeleteActions
  = DeleteWorkflowTemplate
  | DeleteWorkflowTemplateSuccess
  | DeleteWorkflowTemplateError
  | OpenDeleteWorkflowTemplateModal
  | CloseDeleteWorkflowTemplateModal;
