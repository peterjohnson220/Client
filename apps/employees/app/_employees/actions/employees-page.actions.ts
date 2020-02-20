import { Action } from '@ngrx/store';

export const LOADING  = '[Employees/EmployeesPage] Loading';
export const LOADING_ERROR  = '[Employees/EmployeePage] Loading Error';

export class Loading implements Action {
  readonly type = LOADING;

  constructor(public payload: any) {}
}

export class LoadingError implements Action {
  readonly type = LOADING_ERROR;
}

export type Actions
  = Loading
  | LoadingError;
