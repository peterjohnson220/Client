import { Action } from '@ngrx/store';

import { StandardReport } from '../models';

export const GET_STANDARD_REPORTS = '[Data Insights/Data Insights Page] Get Standard Reports';
export const GET_STANDARD_REPORTS_SUCCESS = '[Data Insights/Data Insights Page] Get Standard Reports Success';
export const GET_STANDARD_REPORTS_ERROR = '[Data Insights/Data Insights Page] Get Standard Reports Error';

export class GetStandardReports implements Action {
  readonly type = GET_STANDARD_REPORTS;

  constructor() {}
}

export class GetStandardReportsSuccess implements Action {
  readonly type = GET_STANDARD_REPORTS_SUCCESS;

  constructor(public payload: StandardReport[]) {}
}

export class GetStandardReportsError implements Action {
  readonly type = GET_STANDARD_REPORTS_ERROR;
}

export type Actions
  = GetStandardReports
  | GetStandardReportsSuccess
  | GetStandardReportsError;
