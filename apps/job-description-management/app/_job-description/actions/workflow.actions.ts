import { Action } from '@ngrx/store';

export const LOAD_WORKFLOW_LOG_ENTRIES = '[job-description-management / Workflow] Load Workflow Log Entries';
export const LOAD_WORKFLOW_LOG_ENTRIES_SUCCESS = '[job-description-management / Workflow] Load Workflow Log Entries Success';
export const LOAD_WORKFLOW_LOG_ENTRIES_ERROR = '[job-description-management / Workflow] Load Workflow Log Entries Error';
export const LOAD_WORKFLOW_STEP_SUMMARY = '[job-description-management / Workflow] Load Workflow Step Summary';
export const LOAD_WORKFLOW_STEP_SUMMARY_SUCCESS = '[job-description-management / Workflow] Load Workflow Step Summary Success';
export const LOAD_WORKFLOW_STEP_SUMMARY_ERROR = '[job-description-management / Workflow] Load Workflow Step Summary Error';
export const APPROVE_WORKFLOW_STEP = '[job-description-management / Workflow] Approve Workflow Step';
export const REJECT_WORKFLOW_STEP = '[job-description-management / Workflow] Reject Workflow Step';
export const COMPLETE_WORKFLOW_STEP_SUCCESS = '[job-description-management / Workflow] Complete Workflow Step Success';
export const GET_WORKFLOW_LINK = '[job-description-management / Workflow] Get Workflow Link';
export const GET_WORKFLOW_LINK_SUCCESS = '[job-description-management / Workflow] Get Workflow Link Success';
export const GET_WORKFLOW_LINK_ERROR = '[job-description-management / Workflow] Get Workflow Link Error';


export class LoadWorkflowLogEntries implements Action {
  readonly type = LOAD_WORKFLOW_LOG_ENTRIES;

  constructor(public payload: {jobDescriptionId: number, jobDescriptionRevision: number}) {}
}

export class LoadWorkflowLogEntriesSuccess {
  readonly type = LOAD_WORKFLOW_LOG_ENTRIES_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadWorkflowLogEntriesError {
  readonly type = LOAD_WORKFLOW_LOG_ENTRIES_ERROR;

  constructor(public payload: any) {}
}

export class LoadWorkflowStepSummary implements Action {
  readonly type = LOAD_WORKFLOW_STEP_SUMMARY;

  constructor(public payload: {workflowId: number}) {}
}

export class LoadWorkflowStepSummarySuccess {
  readonly type = LOAD_WORKFLOW_STEP_SUMMARY_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadWorkflowStepSummaryError {
  readonly type = LOAD_WORKFLOW_STEP_SUMMARY_ERROR;

  constructor() {}
}

export class ApproveWorkflowStep implements Action {
  readonly type = APPROVE_WORKFLOW_STEP;

  constructor() {}
}

export class RejectWorkflowStep {
  readonly type = REJECT_WORKFLOW_STEP;

  constructor() {}
}

export class CompleteWorkflowStepSuccess {
  readonly type = COMPLETE_WORKFLOW_STEP_SUCCESS;

  constructor() {}
}

export class GetWorkflowLink implements Action {
  readonly type = GET_WORKFLOW_LINK;

  constructor(public payload: {workflowId: number}) {}
}

export class GetWorkflowLinkSuccess {
  readonly type = GET_WORKFLOW_LINK_SUCCESS;

  constructor(public payload: string) {}
}

export class GetWorkflowLinkError {
  readonly type = GET_WORKFLOW_LINK_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = LoadWorkflowLogEntries
  | LoadWorkflowLogEntriesSuccess
  | LoadWorkflowLogEntriesError
  | LoadWorkflowStepSummary
  | LoadWorkflowStepSummarySuccess
  | LoadWorkflowStepSummaryError
  | ApproveWorkflowStep
  | RejectWorkflowStep
  | CompleteWorkflowStepSuccess
  | GetWorkflowLink
  | GetWorkflowLinkSuccess
  | GetWorkflowLinkError;
