import { Action } from '@ngrx/store';

import { DataCutValidationInfo } from 'libs/models/peer';
import {UpsertPeerDataCutEntityConfigurationModel} from '../../upsert-peer-data-cut/models';

export const LOAD_DATA_CUT_VALIDATION = '[Legacy Content/Data Cut Validation] Load Data Cut Validation';
export const LOAD_DATA_CUT_VALIDATION_SUCCESS = '[Legacy Content/Data Cut Validation] Load Data Cut Validation Success';
export const LOAD_DATA_CUT_VALIDATION_ERROR = '[Legacy Content/Data Cut Validation] Load Data Cut Validation Error';
export const VALIDATE_DATA_CUT_EMPLOYEES = '[Legacy Content/Data Cut Validation] Validate Data Cut Employees';
export const VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS = '[Legacy Content/Data Cut Validation] Validate Data Cut Employees Success';
export const VALIDATE_DATA_CUT_EMPLOYEES_ERROR = '[Legacy Content/Data Cut Validation] Validate Data Cut Error';

export class LoadDataCutValidation implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION;

  constructor(public payload: any) { }
}

export class LoadDataCutValidationSuccess implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION_SUCCESS;

  constructor(public payload: DataCutValidationInfo[]) { }
}

export class LoadDataCutValidationError implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION_ERROR;
}

export class ValidateDataCutEmployees implements Action {
  readonly type = VALIDATE_DATA_CUT_EMPLOYEES;
  constructor(public companyJobId: number, public entityConfiguration: UpsertPeerDataCutEntityConfigurationModel, public dataCutGuid: string) { }
}

export class ValidateDataCutEmployeesSuccess implements Action {
  readonly type = VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS;
  constructor(public payload: boolean) { }
}

export class ValidateDataCutEmployeesError implements Action {
  readonly type = VALIDATE_DATA_CUT_EMPLOYEES_ERROR;
}

export type Actions
  = LoadDataCutValidation
  | LoadDataCutValidationSuccess
  | LoadDataCutValidationError
  | ValidateDataCutEmployees
  | ValidateDataCutEmployeesSuccess
  | ValidateDataCutEmployeesError;
