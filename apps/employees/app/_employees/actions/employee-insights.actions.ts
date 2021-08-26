import { Action } from '@ngrx/store';

import { EmployeeInsights, GetEmployeeInsightsRequest } from 'libs/models/payfactors-api/employees/employee-insights.model';
import { GenericKeyValue } from 'libs/models';

export const GET_EMPLOYEE_INSIGHTS = '[Employees / Employees Insights] Get Employee Insights';
export const GET_EMPLOYEE_INSIGHTS_SUCCESS = '[Employees / Employees Insights] Get Employee Insights Success';
export const GET_EMPLOYEE_INSIGHTS_ERROR = '[Employees / Employees Insights] Get Employee Insights Error';
export const LOAD_CUSTOM_EMPLOYEE_FIELDS = '[Employees / Employees Insights] Load Custom Employee Fields';
export const LOAD_CUSTOM_EMPLOYEE_FIELDS_SUCCESS = '[Employees / Employees Insights] Load Custom Employee Fields Success';
export const LOAD_CUSTOM_EMPLOYEE_FIELDS_ERROR = '[Employees / Employees Insights] Load Custom Employee Fields Error';

export class GetEmployeeInsights implements Action {
  readonly type = GET_EMPLOYEE_INSIGHTS;

  constructor(public payload: GetEmployeeInsightsRequest) {}
}

export class GetEmployeeInsightsSuccess implements Action {
  readonly type = GET_EMPLOYEE_INSIGHTS_SUCCESS;

  constructor(public payload: EmployeeInsights) {}
}

export class GetEmployeeInsightsError implements Action {
  readonly type = GET_EMPLOYEE_INSIGHTS_ERROR;

  constructor() {}
}

export class LoadCustomEmployeeFields implements Action {
  readonly type = LOAD_CUSTOM_EMPLOYEE_FIELDS;

  constructor(public payload: number) {}
}

export class LoadCustomEmployeeFieldsSuccess implements Action {
  readonly type = LOAD_CUSTOM_EMPLOYEE_FIELDS_SUCCESS;

  constructor(public payload: GenericKeyValue<string, string>[]) {}
}

export class LoadCustomEmployeeFieldsError implements Action {
  readonly type = LOAD_CUSTOM_EMPLOYEE_FIELDS_ERROR;

  constructor() {}
}

export type Actions
  = GetEmployeeInsights
  | GetEmployeeInsightsSuccess
  | GetEmployeeInsightsError
  | LoadCustomEmployeeFields
  | LoadCustomEmployeeFieldsSuccess
  | LoadCustomEmployeeFieldsError;
