import { Action } from '@ngrx/store';

export const LOAD_WORKFLOW_TEMPLATE_LIST = '[Settings/WorkflowTemplateList] Load Workflow Template List';
export const LOAD_WORKFLOW_TEMPLATE_LIST_SUCCESS = '[Settings/WorkflowTemplateList] Load Workflow Template List Success';
export const LOAD_WORKFLOW_TEMPLATE_LIST_ERROR = '[Settings/WorkflowTemplateList] Load Workflow Template List Error';

export class LoadWorkflowTemplates implements Action {
    readonly type = LOAD_WORKFLOW_TEMPLATE_LIST;
}

export class LoadWorkflowTemplatesSuccess implements Action {
    readonly type = LOAD_WORKFLOW_TEMPLATE_LIST_SUCCESS;

    constructor(public payload: any[]) {}
}

export class LoadWorkflowTemplatesError implements Action {
    readonly type = LOAD_WORKFLOW_TEMPLATE_LIST_ERROR;
}

export type ListActions
  = LoadWorkflowTemplates
  | LoadWorkflowTemplatesSuccess
  | LoadWorkflowTemplatesError;
