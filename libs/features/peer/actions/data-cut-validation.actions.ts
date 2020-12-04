import { Action } from '@ngrx/store';

import { DataCutValidationInfo } from 'libs/models/peer';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';
import { UpsertPeerDataCutEntityConfigurationModel } from '../../upsert-peer-data-cut/models';

export const LOAD_DATA_CUT_VALIDATION = '[Features/Peer/Data Cut Validation] Load Data Cut Validation';
export const LOAD_TEMP_DATA_CUT_VALIDATION = '[Features/Peer/Data Cut Validation] Load Temp Data Cut Validation';
export const LOAD_DATA_CUT_VALIDATION_SUCCESS = '[Features/Peer/Data Cut Validation] Load Data Cut Validation Success';
export const LOAD_DATA_CUT_VALIDATION_ERROR = '[Features/Peer/Data Cut Validation] Load Data Cut Validation Error';
export const ADD_TEMP_DATA_CUT_VALIDATION = '[Features/Peer/Data Cut Validation] Add Temp Data Cut Validation';
export const VALIDATE_DATA_CUT_EMPLOYEES = '[Features/Peer/Data Cut Validation] Validate Data Cut Employees';
export const VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS = '[Features/Peer/Data Cut Validation] Validate Data Cut Employees Success';
export const VALIDATE_DATA_CUT_EMPLOYEES_ERROR = '[Features/Peer/Data Cut Validation] Validate Data Cut Error';

export class LoadDataCutValidation implements Action {
  readonly type = LOAD_DATA_CUT_VALIDATION;

  constructor(public payload: any) { }
}

export class LoadTempDataCutValidation implements Action {
  readonly type = LOAD_TEMP_DATA_CUT_VALIDATION;

  constructor(public payload: {hasProjectContext: boolean}) { }
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
  constructor(public payload:
      { companyJobId: number, entityConfiguration: UpsertPeerDataCutEntityConfigurationModel, dataCutGuid: string } |
      { tempExchangeJobDataCutFilterContexts: BaseExchangeDataSearchRequest[], existingDataCutGuids: string[] }
  ) { }
}

export class ValidateDataCutEmployeesSuccess implements Action {
  readonly type = VALIDATE_DATA_CUT_EMPLOYEES_SUCCESS;
  constructor(public payload: boolean) { }
}

export class ValidateDataCutEmployeesError implements Action {
  readonly type = VALIDATE_DATA_CUT_EMPLOYEES_ERROR;
}

export class AddTempDataCutValidation implements Action {
  readonly type = ADD_TEMP_DATA_CUT_VALIDATION;

  constructor(public payload: DataCutValidationInfo) { }
}

export type Actions
  = LoadDataCutValidation
  | LoadTempDataCutValidation
  | LoadDataCutValidationSuccess
  | LoadDataCutValidationError
  | ValidateDataCutEmployees
  | ValidateDataCutEmployeesSuccess
  | ValidateDataCutEmployeesError
  | AddTempDataCutValidation;
