import { Action } from '@ngrx/store';

import { TableauReport } from '../models';

export const GET_COMPANY_REPORTS = '[Data Insights / All Dashboards] Get Company Reports';
export const GET_COMPANY_REPORTS_SUCCESS = '[Data Insights / All Dashboards] Get Company Reports Success';
export const GET_COMPANY_REPORTS_ERROR = '[Data Insights / All Dashboards] Get Company Reports Error';

export class GetCompanyReports implements Action {
  readonly type = GET_COMPANY_REPORTS;

  constructor() {}
}

export class GetCompanyReportsSuccess implements Action {
  readonly type = GET_COMPANY_REPORTS_SUCCESS;

  constructor( public payload: { tableauReports: TableauReport[] }) {}
}

export class GetCompanyReportsError implements Action {
  readonly type = GET_COMPANY_REPORTS_ERROR;

  constructor() {}
}

export type Actions
  = GetCompanyReports
  | GetCompanyReportsSuccess
  | GetCompanyReportsError;

