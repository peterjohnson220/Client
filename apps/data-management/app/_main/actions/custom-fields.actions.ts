import { Action } from '@ngrx/store';


export const GET_CUSTOM_JOB_FIELDS = '[Org Data Autoloader/Field Mappings] Get Custom Job Fields';
export const GET_CUSTOM_JOB_FIELDS_ERROR = '[Org Data Autoloader/Field Mappings] Get Custom Job Fields Error';
export const GET_CUSTOM_JOB_FIELDS_SUCCESS = '[Org Data Autoloader/Field Mappings] Get Custom Job Fields Success';
export const GET_CUSTOM_EMPLOYEE_FIELDS = '[Org Data Autoloader/Field Mappings] Get Custom Employee Fields';
export const GET_CUSTOM_EMPLOYEE_FIELDS_ERROR = '[Org Data Autoloader/Field Mappings] Get Custom Employee Fields Error';
export const GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS = '[Org Data Autoloader/Field Mappings] Get Custom Employee Fields Success';



export class GetCustomJobFields implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS;

  constructor(public payload: number) {}
}
export class GetCustomJobFieldsError implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS_ERROR;

}
export class GetCustomJobFieldsSuccess implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS_SUCCESS;

  constructor(public payload: any) {}
}
export class GetCustomEmployeeFields implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS;

  constructor(public payload: number) {}
}
export class GetCustomEmployeeFieldsError implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS_ERROR;

}
export class GetCustomEmployeeFieldsSuccess implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS;

  constructor(public payload: any) {}
}

export type Actions
  = GetCustomJobFields
  | GetCustomJobFieldsError
  | GetCustomJobFieldsSuccess
  | GetCustomEmployeeFields
  | GetCustomEmployeeFieldsError
  | GetCustomEmployeeFieldsSuccess;
