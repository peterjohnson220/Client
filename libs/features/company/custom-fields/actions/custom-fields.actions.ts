import { Action } from '@ngrx/store';

export const GET_CUSTOM_JOB_FIELDS = '[Data Management/ Custom Fields] Get Custom Job Fields';
export const GET_CUSTOM_JOB_FIELDS_ERROR = '[Data Management/ Custom Fields] Get Custom Job Fields Error';
export const GET_CUSTOM_JOB_FIELDS_SUCCESS = '[Data Management/ Custom Fields] Get Custom Job Fields Success';
export const GET_CUSTOM_EMPLOYEE_FIELDS = '[Data Management/ Custom Fields] Get Custom Employee Fields';
export const GET_CUSTOM_EMPLOYEE_FIELDS_ERROR = '[Data Management/ Custom Fields] Get Custom Employee Fields Error';
export const GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS = '[Data Management/ Custom Fields] Get Custom Employee Fields Success';
export const GET_TAGCATEGORIES = '[Data Management/ Custom Fields] Get Tag Categories';
export const GET_TAGCATEGORIES_ERROR = '[Data Management/ Custom Fields] Get Tag Categories Error';
export const GET_TAGCATEGORIES_SUCCESS = '[Data Management/ Custom Fields] Get Tag Categories Success';
export const GET_BENEFITHEADERS = '[Data Management/ Custom Fields] Get Benefits';
export const GET_BENEFITS_ERROR = '[Data Management/ Custom Fields] Get Benefits Error';
export const GET_BENEFITS_SUCCESS = '[Data Management/ Custom Fields] Get Benefits Success';

export class GetCustomJobFields implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS;
  constructor(public payload: number) { }
}
export class GetCustomJobFieldsError implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS_ERROR;
}

export class GetCustomJobFieldsSuccess implements Action {
  readonly type = GET_CUSTOM_JOB_FIELDS_SUCCESS;
  constructor(public payload: any) { }
}
export class GetCustomEmployeeFields implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS;
  constructor(public payload: number) { }
}
export class GetCustomEmployeeFieldsError implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS_ERROR;
}

export class GetCustomEmployeeFieldsSuccess implements Action {
  readonly type = GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS;
  constructor(public payload: any) { }
}

export class GetTagCategories implements Action {
  readonly type = GET_TAGCATEGORIES;
  constructor(public companyId: any) { }
}

export class GetTagCategoriesError implements Action {
  readonly type = GET_TAGCATEGORIES_ERROR;
}

export class GetTagCategoriesSuccess implements Action {
  readonly type = GET_TAGCATEGORIES_SUCCESS;
  constructor(public payload: any) { }
}

export class GetBenefitHeaders implements Action {
  readonly type = GET_BENEFITHEADERS;
}

export class GetBenefitHeadersError implements Action {
  readonly type = GET_BENEFITS_ERROR;
}

export class GetBenefitHeadersSuccess implements Action {
  readonly type = GET_BENEFITS_SUCCESS;
  constructor(public payload: any) { }
}

export type Actions
  = GetCustomJobFields
  | GetCustomJobFieldsError
  | GetCustomJobFieldsSuccess
  | GetCustomEmployeeFields
  | GetCustomEmployeeFieldsError
  | GetCustomEmployeeFieldsSuccess
  | GetTagCategories
  | GetTagCategoriesSuccess
  | GetTagCategoriesError
  | GetBenefitHeaders
  | GetBenefitHeadersSuccess
  | GetBenefitHeadersError;
