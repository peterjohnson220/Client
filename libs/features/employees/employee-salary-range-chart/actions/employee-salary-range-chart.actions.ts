import { Action } from '@ngrx/store';

import { EmployeeModalStructuresResponse } from 'libs/models/payfactors-api';

import { EmployeeForSalaryRangeChart } from '../models';

export const GET_EMPLOYEE_STRUCTURES = '[Employee Salary Range Chart] Get Employee Structures';
export const GET_EMPLOYEE_STRUCTURES_SUCCESS = '[Employee Salary Range Chart] Get Employee Structures Success';
export const GET_EMPLOYEE_STRUCTURES_ERROR = '[Employee Salary Range Chart] Get Employee Structures Error';

export class GetEmployeeStructures implements Action {
  readonly type = GET_EMPLOYEE_STRUCTURES;
  constructor(public payload: EmployeeForSalaryRangeChart) {}
}

export class GetEmployeeStructuresSuccess implements Action {
  readonly type = GET_EMPLOYEE_STRUCTURES_SUCCESS;
  constructor(public payload: EmployeeModalStructuresResponse[]) {}
}

export class GetEmployeeStructuresError implements Action {
  readonly type = GET_EMPLOYEE_STRUCTURES_ERROR;
  constructor() {}
}

export type Actions
  = GetEmployeeStructures
  | GetEmployeeStructuresSuccess
  | GetEmployeeStructuresError;
