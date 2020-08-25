import { Action } from '@ngrx/store';
import { WorkflowStepInfo } from 'libs/models/security';
import { CancelWorkflow, Workflow } from '../models';

export const LOAD_WORKFLOW_LOG_ENTRIES = '[job-description-management / Workflow] Load Workflow Log Entries';
export const LOAD_WORKFLOW_LOG_ENTRIES_SUCCESS = '[job-description-management / Workflow] Load Workflow Log Entries Success';
export const LOAD_WORKFLOW_LOG_ENTRIES_ERROR = '[job-description-management / Workflow] Load Workflow Log Entries Error';
export const LOAD_WORKFLOW_STEP_SUMMARY = '[job-description-management / Workflow] Load Workflow Step Summary';
export const LOAD_WORKFLOW_STEP_SUMMARY_SUCCESS = '[job-description-management / Workflow] Load Workflow Step Summary Success';
export const LOAD_WORKFLOW_STEP_SUMMARY_ERROR = '[job-description-management / Workflow] Load Workflow Step Summary Error';
export const APPROVE_WORKFLOW_STEP = '[job-description-management / Workflow] Approve Workflow Step';
export const REJECT_WORKFLOW_STEP = '[job-description-management / Workflow] Reject Workflow Step';
export const COMPLETE_WORKFLOW_STEP_SUCCESS = '[job-description-management / Workflow] Complete Workflow Step Success';
export const COMPLETE_WORKFLOW_STEP_ERROR = '[job-description-management / Workflow] Complete Workflow Step Error';
export const GET_WORKFLOW_LINK = '[job-description-management / Workflow] Get Workflow Link';
export const GET_WORKFLOW_LINK_SUCCESS = '[job-description-management / Workflow] Get Workflow Link Success';
export const GET_WORKFLOW_LINK_ERROR = '[job-description-management / Workflow] Get Workflow Link Error';
export const CANCEL_APPROVAL = '[job-description-management / Workflow] Cancel Approval';
export const CANCEL_APPROVAL_SUCCESS = '[job-description-management / Workflow] Cancel Approval Success';
export const CANCEL_APPROVAL_ERROR = '[job-description-management / Workflow] Cancel Approval Error';
export const RESEND_EMAIL = '[job-description-management / Workflow] Resend Email';
export const RESEND_EMAIL_SUCCESS = '[job-description-management / Workflow] Resend Email Success';
export const RESEND_EMAIL_ERROR = '[job-description-management / Workflow] Resend Email Error';
// Workflow Setup
export const BUILD_WORKFLOW_SAVE_OBJ = '[job-description-management / Workflow] Build Workflow Save Obj';
export const SAVING_WORKFLOW = '[job-description-management / Workflow] Saving Workflow';
export const SAVING_WORKFLOW_SUCCESS = '[job-description-management / Workflow] Saving Workflow Success';
export const SAVING_WORKFLOW_ERROR = '[job-description-management / Workflow] Saving Workflow Error';
export const CREATE_WORKFLOW = '[job-description-management / Workflow] Create Workflow';
export const UPDATE_WORKFLOW_INITIATION_COMMENT = '[job-description-management / Workflow] Update Workflow Initiation Comment';
export const UPDATE_WORKFLOW_STEPS = '[job-description-management / Workflow] Update Workflow Steps';
// Workflow Step Messages
export const SET_MESSAGE = '[job-description-management / Workflow] Set Message';


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

  constructor(public payload: {workflowStepInfo: WorkflowStepInfo, willProceed: boolean, comment: string}) {}
}

export class RejectWorkflowStep {
  readonly type = REJECT_WORKFLOW_STEP;

  constructor(public payload: {workflowStepInfo: WorkflowStepInfo, willProceed: boolean, comment: string}) {}
}

export class CompleteWorkflowStepSuccess {
  readonly type = COMPLETE_WORKFLOW_STEP_SUCCESS;

  constructor(public payload: {workflowStepInfo: WorkflowStepInfo, willProceed: boolean}) {}
}

export class CompleteWorkflowStepError {
  readonly type = COMPLETE_WORKFLOW_STEP_ERROR;

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

export class CancelApproval implements Action {
  readonly type = CANCEL_APPROVAL;

  constructor(public payload: CancelWorkflow) {}
}

export class BuildWorkflowSaveObj implements Action {
  readonly type = BUILD_WORKFLOW_SAVE_OBJ;

  constructor() {}
}

export class SavingWorkflow implements Action {
  readonly type = SAVING_WORKFLOW;

  constructor(public payload: Workflow) {}
}

export class SavingWorkflowSuccess implements Action {
  readonly type = SAVING_WORKFLOW_SUCCESS;

  constructor() {}
}

export class SavingWorkflowError implements Action {
  readonly type = SAVING_WORKFLOW_ERROR;

  constructor() {}
}

export class CreateWorkflow implements Action {
  readonly type = CREATE_WORKFLOW;

  constructor(public payload: {entityId: number, workflowUrl: string, entityTitle: string, revision: number}) {}
}

export class UpdateWorkflowInitiationComment implements Action {
  readonly type = UPDATE_WORKFLOW_INITIATION_COMMENT;

  constructor(public payload: {comment: string}) {}
}

export class UpdateWorkflowSteps implements Action {
  readonly type = UPDATE_WORKFLOW_STEPS;

  constructor(public payload: {steps: any[]}) {}
}

export class SetMessage implements Action {
  readonly type = SET_MESSAGE;

  constructor(public payload: {message: string}) {}
}

export class ResendEmail implements Action {
  readonly type = RESEND_EMAIL;

  constructor(public payload: {workflowId: number}) {}
}

export class ResendEmailSuccess {
  readonly type = RESEND_EMAIL_SUCCESS;
}

export class ResendEmailError {
  readonly type = RESEND_EMAIL_ERROR;
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
  | CompleteWorkflowStepError
  | GetWorkflowLink
  | GetWorkflowLinkSuccess
  | GetWorkflowLinkError
  | CancelApproval
  | BuildWorkflowSaveObj
  | SavingWorkflow
  | SavingWorkflowSuccess
  | SavingWorkflowError
  | CreateWorkflow
  | UpdateWorkflowInitiationComment
  | UpdateWorkflowSteps
  | SetMessage
  | ResendEmail
  | ResendEmailSuccess
  | ResendEmailError;
