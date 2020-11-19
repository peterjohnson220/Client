import { Action } from '@ngrx/store';

export const PRICE_JOBS = '[Employees / Employees Page] Price Jobs';
export const PRICE_JOBS_SUCCESS = '[Employees / Employees Page] Price Jobs Success';
export const PRICE_JOBS_ERROR = '[Employees / Employees Page] Price Jobs Error';
export const RESET_PRICING_JOBS_STATUS = '[Employees / Employees Page] Reset Pricing Jobs Status';
export const DELETE_EMPLOYEE = '[Employees / Employees Page] Delete Employee';
export const DELETE_EMPLOYEE_SUCCESS  = '[Employees / EmployeesPage] Delete Employee Success';
export const DELETE_EMPLOYEE_ERROR  = '[Employees  / EmployeePage] Delete Employee Error';
export const GENERATE_STATEMENT = '[Employees  / EmployeePage] Generate Statement';
export const GENERATE_STATEMENT_SUCCESS = '[Employees  / EmployeePage] Generate Statement Success';
export const GENERATE_STATEMENT_ERROR = '[Employees  / EmployeePage] Generate Statement Error';

export class PriceJobs implements Action {
  readonly type = PRICE_JOBS;

  constructor(public payload: { companyEmployeeIds: number[] }) {}
}

export class PriceJobsSuccess implements Action {
  readonly type = PRICE_JOBS_SUCCESS;

  constructor(public payload: { projectId: number }) {}
}

export class PriceJobsError implements Action {
  readonly type = PRICE_JOBS_ERROR;

  constructor() {}
}

export class ResetPricingJobsStatus implements Action {
  readonly type = RESET_PRICING_JOBS_STATUS;

  constructor() {}
}

export class DeleteEmployee implements Action {
  readonly type = DELETE_EMPLOYEE;

  constructor(public payload: { pageViewId: string, companyEmployeeIds: number[] }) {}
}

export class DeleteEmployeeSuccess implements Action {
  readonly type = DELETE_EMPLOYEE_SUCCESS;

  constructor() {}
}

export class DeleteEmployeeError implements Action {
  readonly type = DELETE_EMPLOYEE_ERROR;

  constructor() {}
}

export class GenerateStatement implements Action {
  readonly type = GENERATE_STATEMENT;
  constructor(public payload: { statementId: string, companyEmployeeIds: number[] }) {}
}

export class GenerateStatementSuccess implements Action {
  readonly type = GENERATE_STATEMENT_SUCCESS;
  constructor() {}
}

export class GenerateStatementError implements Action {
  readonly type = GENERATE_STATEMENT_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = PriceJobs
  | PriceJobsSuccess
  | PriceJobsError
  | ResetPricingJobsStatus
  | DeleteEmployee
  | DeleteEmployeeSuccess
  | DeleteEmployeeError;
