import { Action } from '@ngrx/store';
import { Workbook } from 'libs/features/reports/models';

export const GET_TABULAR_REPORTS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports';
export const GET_TABULAR_REPORTS_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports Success';
export const GET_TABULAR_REPORTS_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports Error';

export class GetTabularReports implements Action {
  readonly type = GET_TABULAR_REPORTS;

  constructor() {}
}

export class GetTabularReportsSuccess implements Action {
  readonly type = GET_TABULAR_REPORTS_SUCCESS;

  constructor(public payload: Workbook[]) {}
}

export class GetTabularReportsError implements Action {
  readonly type = GET_TABULAR_REPORTS_ERROR;

  constructor() {}
}

export type Actions
  = GetTabularReports
  | GetTabularReportsSuccess
  | GetTabularReportsError;
