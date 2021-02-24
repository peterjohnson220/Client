import { Action } from '@ngrx/store';

import { EmployeeBenefit, SaveEmployeeBenefitsRequest } from 'libs/models/payfactors-api/employees';

export const LOAD_EMPLOYEE_BENEFITS = '[EmployeeManagement] Load Employee Benefits';
export const LOAD_EMPLOYEE_BENEFITS_SUCCESS = '[EmployeeManagement] Load Employee Benefits Success';
export const LOAD_EMPLOYEE_BENEFITS_ERROR = '[EmployeeManagement] Load Employee Benefits Error';
export const SAVE_EMPLOYEE_BENEFITS = '[EmployeeManagement] Save Employee Benefits';
export const SAVE_EMPLOYEE_BENEFITS_SUCCESS = '[EmployeeManagement] Save Employee Benefits Success';
export const SAVE_EMPLOYEE_BENEFITS_ERROR = '[EmployeeManagement] Save Employee Benefits Error';

export class LoadEmployeeBenefits implements Action {
  readonly type = LOAD_EMPLOYEE_BENEFITS;

  constructor(public payload: { companyEmployeeId: number, employeeId: string }) {}
}

export class LoadEmployeeBenefitsSuccess implements Action {
  readonly type = LOAD_EMPLOYEE_BENEFITS_SUCCESS;

  constructor(public payload: EmployeeBenefit[]) {}
}

export class LoadEmployeeBenefitsError implements Action {
  readonly type = LOAD_EMPLOYEE_BENEFITS_ERROR;

  constructor() {}
}

export class SaveEmployeeBenefits implements Action {
  readonly type = SAVE_EMPLOYEE_BENEFITS;

  constructor(public payload: SaveEmployeeBenefitsRequest) {}
}

export class SaveEmployeeBenefitsSuccess implements Action {
  readonly type = SAVE_EMPLOYEE_BENEFITS_SUCCESS;
  constructor() {}
}

export class SaveEmployeeBenefitsError implements Action {
  readonly type = SAVE_EMPLOYEE_BENEFITS_ERROR;
  constructor() {}
}

export type Actions
  = LoadEmployeeBenefits
  | LoadEmployeeBenefitsSuccess
  | LoadEmployeeBenefitsError
  | SaveEmployeeBenefits
  | SaveEmployeeBenefitsSuccess
  | SaveEmployeeBenefitsError;
