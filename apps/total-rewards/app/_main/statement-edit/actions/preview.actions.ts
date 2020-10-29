import { Action } from '@ngrx/store';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards/response';
import { GenericNameValue } from 'libs/models/common';

// PREVIEW
export const SEARCH_ASSIGNED_EMPLOYEES = '[Total Rewards/Preview Statement] Search Employees';
export const SEARCH_ASSIGNED_EMPLOYEES_SUCCESS = '[Total Rewards/Preview Statement] Search Employees Success';
export const SEARCH_ASSIGNED_EMPLOYEES_ERROR = '[Total Rewards/Preview Statement] Search Employees Error';
export const GET_EMPLOYEE_REWARDS_DATA = '[Total Rewards/Preview Statement] Get Employee Rewards Data';
export const GET_EMPLOYEE_REWARDS_DATA_SUCCESS = '[Total Rewards/Preview Statement] Get Employee Rewards Data Success';
export const GET_EMPLOYEE_REWARDS_DATA_ERROR = '[Total Rewards/Preview Statement] Get Employee Rewards Data Error';
export const RESET_EMPLOYEE_REWARDS_DATA = '[Total Rewards/Preview Statement] Reset Employee Rewards Data';

export class SearchAssignedEmployees implements Action {
  readonly type = SEARCH_ASSIGNED_EMPLOYEES;
  constructor(public payload: { statementId: string, searchTerm: string }) {}
}

export class SearchAssignedEmployeesSuccess implements Action {
  readonly type = SEARCH_ASSIGNED_EMPLOYEES_SUCCESS;
  constructor(public payload: GenericNameValue<number>[]) {}
}

export class SearchAssignedEmployeesError implements Action {
  readonly type = SEARCH_ASSIGNED_EMPLOYEES_ERROR;
  constructor() {}
}

export class GetEmployeeRewardsData implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA;
  constructor(public payload: { companyEmployeeId: number }) {}
}

export class GetEmployeeRewardsDataSuccess implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA_SUCCESS;
  constructor(public payload: EmployeeRewardsData) {}
}

export class GetEmployeeRewardsDataError implements Action {
  readonly type = GET_EMPLOYEE_REWARDS_DATA_ERROR;
  constructor() {}
}

export class ResetEmployeeRewardsData implements Action {
  readonly type = RESET_EMPLOYEE_REWARDS_DATA;
  constructor() {}
}

export type PreviewActions =
  SearchAssignedEmployees |
  SearchAssignedEmployeesSuccess |
  SearchAssignedEmployeesError |
  GetEmployeeRewardsData |
  GetEmployeeRewardsDataSuccess |
  GetEmployeeRewardsDataError |
  ResetEmployeeRewardsData;
