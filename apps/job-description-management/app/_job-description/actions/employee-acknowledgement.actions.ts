import { Action } from '@ngrx/store';
import { EmployeeAcknowledgement } from '../models';

export const LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO = '[job-description-management / Employee Acknowledgement] Load Employee Acknowledgement Info';
export const LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_SUCCESS = '[job-description-management / Employee Acknowledgement] Load Employee Acknowledgement Info Success';
export const LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_ERROR = '[job-description-management / Employee Acknowledgement] Load Employee Acknowledgement Info Error';
export const ACKNOWLEDGE = '[job-description-management / Employee Acknowledgement] Acknowledge';
export const ACKNOWLEDGE_SUCCESS = '[job-description-management / Employee Acknowledgement] Acknowledge Success';
export const ACKNOWLEDGE_ERROR = '[job-description-management / Employee Acknowledgement] Acknowledge Error';

export class LoadEmployeeAcknowledgementInfo implements Action {
  readonly type = LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO;

  constructor() {}
}

export class LoadEmployeeAcknowledgementInfoSuccess implements Action {
  readonly type = LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_SUCCESS;

  constructor(public payload: EmployeeAcknowledgement) {}
}

export class LoadEmployeeAcknowledgementInfoError implements Action {
  readonly type = LOAD_EMPLOYEE_ACKNOWLEDGEMENT_INFO_ERROR;

  constructor() {}
}

export class Acknowledge implements Action {
  readonly type = ACKNOWLEDGE;

  constructor(public payload: {signature: string}) {}
}

export class AcknowledgeSuccess implements Action {
  readonly type = ACKNOWLEDGE_SUCCESS;

  constructor(public payload: EmployeeAcknowledgement) {}
}

export class AcknowledgeError implements Action {
  readonly type = ACKNOWLEDGE_ERROR;

  constructor() {}
}

export type Actions
  = LoadEmployeeAcknowledgementInfo
  | LoadEmployeeAcknowledgementInfoSuccess
  | LoadEmployeeAcknowledgementInfoError
  | Acknowledge
  | AcknowledgeSuccess
  | AcknowledgeError;
