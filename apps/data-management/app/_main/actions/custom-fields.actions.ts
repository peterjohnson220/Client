import { Action } from '@ngrx/store';


export const GET_CUSTOM_JOB_FIELDS = '[Data Management/ Custom Fields] Get Custom Job Fields';
export const GET_CUSTOM_JOB_FIELDS_ERROR = '[Data Management/ Custom Fields] Get Custom Job Fields Error';
export const GET_CUSTOM_JOB_FIELDS_SUCCESS = '[Data Management/ Custom Fields] Get Custom Job Fields Success';
export const GET_CUSTOM_EMPLOYEE_FIELDS = '[Data Management/ Custom Fields] Get Custom Employee Fields';
export const GET_CUSTOM_EMPLOYEE_FIELDS_ERROR = '[Data Management/ Custom Fields] Get Custom Employee Fields Error';
export const GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS = '[Data Management/ Custom Fields] Get Custom Employee Fields Success';
export const LOAD_CUSTOM_FIELDS_BY_ENTITY = '[Data Management/ Custom Fields] Load Custom Fields By Entity';


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
export class LoadCustomFieldsByEntity implements Action {
  readonly type = LOAD_CUSTOM_FIELDS_BY_ENTITY;

  constructor(public payload: { entity: string, companyId: number }) {}
}


export type Actions
  = GetCustomJobFields
  | GetCustomJobFieldsError
  | GetCustomJobFieldsSuccess
  | GetCustomEmployeeFields
  | GetCustomEmployeeFieldsError
  | GetCustomEmployeeFieldsSuccess
  | LoadCustomFieldsByEntity;
