import { Action } from '@ngrx/store';

import { WorkflowTemplate, WorkflowStep } from 'libs/features/jobs/job-description-management/models';

export const BUILD_WORKFLOW_TEMPLATE_SAVE_OBJ = '[Settings/WorkflowTemplateList/Upsert] Update Workflow Template Save Obj';
export const UPDATE_WORKFLOW_TEMPLATE = '[Settings/WorkflowTemplateList/Upsert] Update Workflow Template';
export const SAVE_WORKFLOW_TEMPLATE = '[Settings/WorkflowTemplateList/Upsert] Save Workflow Template';
export const SAVE_WORKFLOW_TEMPLATE_SUCCESS = '[Settings/WorkflowTemplateList/Upsert] Save Workflow Template Success';
export const SAVE_WORKFLOW_TEMPLATE_ERROR = '[Settings/WorkflowTemplateList/Upsert] Save Workflow Template Error';
export const POPULATE_WORKFLOW_TEMPLATE = '[Settings/WorkflowTemplateList/Upsert] Populate Workflow Template';
export const CLOSE_UPSERT_WORKFLOW_TEMPLATE_MODAL = '[Settings/WorkflowTemplateList/Upsert] Close Upsert Workflow Template Modal';

export class BuildWorkflowTemplateSaveObj implements Action {
  readonly type = BUILD_WORKFLOW_TEMPLATE_SAVE_OBJ;
}

export class UpdateWorkflowTemplate implements Action {
  readonly type = UPDATE_WORKFLOW_TEMPLATE;

  constructor(public payload: {name: string, steps: WorkflowStep[]}) {}
}

export class SaveWorkflowTemplate implements Action {
    readonly type = SAVE_WORKFLOW_TEMPLATE;

    constructor(public payload: {template: any}) {}
}

export class SaveWorkflowTemplateSuccess implements Action {
    readonly type = SAVE_WORKFLOW_TEMPLATE_SUCCESS;
}

export class SaveWorkflowTemplateError implements Action {
    readonly type = SAVE_WORKFLOW_TEMPLATE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class PopulateWorkflowTemplate implements Action {
  readonly type = POPULATE_WORKFLOW_TEMPLATE;

  constructor(public payload: WorkflowTemplate) {}
}

export class CloseUpsertWorkflowTemplateModal implements Action {
  readonly type = CLOSE_UPSERT_WORKFLOW_TEMPLATE_MODAL;
}
export type UpsertActions
  = BuildWorkflowTemplateSaveObj
  | UpdateWorkflowTemplate
  | SaveWorkflowTemplate
  | SaveWorkflowTemplateSuccess
  | SaveWorkflowTemplateError
  | PopulateWorkflowTemplate
  | CloseUpsertWorkflowTemplateModal;
