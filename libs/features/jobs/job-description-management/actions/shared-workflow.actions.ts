import { Action } from '@ngrx/store';
import { WorkflowStep, WorkflowUser } from '../models';
// Workflow Template List
export const LOAD = '[job-description-management / Workflow Template List] Load Workflow Template List';
export const LOAD_SUCCESS = '[job-description-management / Workflow Template List] Load Workflow Template List Success';
export const LOAD_ERROR = '[job-description-management / Workflow Template List] Load Workflow Template List Error';
export const SAVE_TEMPLATE = '[job-description-management / Workflow Template List] Save Workflow Template List';
export const SAVE_TEMPLATE_SUCCESS = '[job-description-management / Workflow Template List] Save Workflow Template List Success';
export const SAVE_TEMPLATE_ERROR = '[job-description-management / Workflow Template List] Save Workflow Template List Error';
export const DELETE_TEMPLATE = '[job-description-management / Workflow Template List] Delete Workflow Template From List';
export const DELETE_TEMPLATE_SUCCESS = '[job-description-management / Workflow Template List] Delete Workflow Template From List Success';
export const DELETE_TEMPLATE_ERROR = '[job-description-management / Workflow Template List] Delete Workflow Template From List Error';
// User or Email Picker
export const RESTRICT_WORKFLOW_TO_COMPANY_EMPLOYEES = '[job-description-management / Workflow Search Bar] Restrict Workflow To Company Employees Only';
// Workflow User Rerouting
export const SET_NEW_USER = '[job-description-management / Workflow User Rerouting] Set New User For Workflow Step';
export const RESET_NEW_USER = '[job-description-management / Workflow User Rerouting] Reset New User For Workflow Step';
export const SET_NEW_USER_PERMISSIONS = '[job-description-management / Workflow User Rerouting] Set New User Permissions For Workflow Step';
export const ROUTE_NEW_USER = '[job-description-management / Workflow User Rerouting] Route To New User';
export const ROUTING_TO_NEW_USER = '[job-description-management / Workflow User Rerouting] Rerouting To New User';
export const ROUTING_TO_NEW_USER_SUCCESS = '[job-description-management / Workflow User Rerouting] Rerouting To New User Success';
export const ROUTING_TO_NEW_USER_ERROR = '[job-description-management / Workflow User Rerouting] Rerouting To New User Error';


export class Load implements Action {
  readonly type = LOAD;

  constructor(public payload: number) {}
}

export class LoadSuccess implements Action {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: {templateList: any[]}) {}
}

export class LoadError implements Action {
  readonly type = LOAD_ERROR;

  constructor() {}
}

export class SaveTemplate implements Action {
  readonly type = SAVE_TEMPLATE;

  constructor() {}
}

export class SaveTemplateSuccess implements Action {
  readonly type = SAVE_TEMPLATE_SUCCESS;

  constructor(public payload: {workflowTemplate: any} ) {}
}

export class SaveTemplateError implements Action {
  readonly type = SAVE_TEMPLATE_ERROR;

  constructor() {}
}

export class DeleteTemplate implements Action {
  readonly type = DELETE_TEMPLATE;

  constructor() {}
}

export class DeleteTemplateSuccess implements Action {
  readonly type = DELETE_TEMPLATE_SUCCESS;

  constructor(public payload: {workflowTemplateId: number}) {}
}

export class DeleteTemplateError implements Action {
  readonly type = DELETE_TEMPLATE_ERROR;

  constructor() {}
}

export class RestrictWorkflowToCompanyEmployees implements Action {
  readonly type = RESTRICT_WORKFLOW_TO_COMPANY_EMPLOYEES;

  constructor(public payload: {companyId: number}) {}
}

export class SetNewUser implements Action {
  readonly type = SET_NEW_USER;

  constructor(public payload: {user: WorkflowUser}) {}
}

export class ResetNewUser implements Action {
  readonly type = RESET_NEW_USER;

  constructor() {}
}

export class SetNewUserPermissions implements Action {
  readonly type = SET_NEW_USER_PERMISSIONS;

  constructor(public payload: {permission: string, selected: boolean}) {}
}
export class RouteNewUser implements Action {
  readonly type = ROUTE_NEW_USER;

  constructor() {}
}

export class RoutingToNewUser implements Action {
  readonly type = ROUTING_TO_NEW_USER;

  constructor(public payload: {workflowId: number, newWorkflowUser: WorkflowUser, comment: string}) {}
}

export class RoutingToNewUserSuccess implements Action {
  readonly type = ROUTING_TO_NEW_USER_SUCCESS;

  constructor() {}
}
export class RoutingToNewUserError implements Action {
  readonly type = ROUTING_TO_NEW_USER_ERROR;

  constructor() {}
}


export type Actions
  = Load
  | LoadSuccess
  | LoadError
  | SaveTemplate
  | SaveTemplateSuccess
  | SaveTemplateError
  | DeleteTemplate
  | DeleteTemplateSuccess
  | DeleteTemplateError
  | RestrictWorkflowToCompanyEmployees
  | SetNewUser
  | ResetNewUser
  | SetNewUserPermissions
  | RouteNewUser
  | RoutingToNewUser
  | RoutingToNewUserSuccess
  | RoutingToNewUserError;
