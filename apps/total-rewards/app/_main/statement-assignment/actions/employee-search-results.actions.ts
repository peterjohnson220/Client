import { Action } from '@ngrx/store';

import { EmployeeSearchResult } from 'libs/models/payfactors-api/total-rewards/response/employee-search-response.model';

export const REPLACE_EMPLOYEE_RESULTS = '[Total Rewards / Employee Search] Replace Employee Search Results';
export const ADD_EMPLOYEE_RESULTS = '[Total Rewards / Employee Search] Add Employee Search Results';
export const CLEAR_EMPLOYEE_RESULTS = '[Total Rewards / Employee Search] Clear Employee Search Results';

export class ReplaceEmployeeResults implements Action {
  readonly type = REPLACE_EMPLOYEE_RESULTS;

  constructor(public payload: EmployeeSearchResult[]) {}
}

export class AddEmployeeResults implements Action {
  readonly type = ADD_EMPLOYEE_RESULTS;

  constructor(public payload: EmployeeSearchResult[]) {}
}

export class ClearEmployeeResults implements Action {
  readonly type = CLEAR_EMPLOYEE_RESULTS;
}

export type EmployeeSearchResultsActions
  = ReplaceEmployeeResults |
  AddEmployeeResults |
  ClearEmployeeResults;
