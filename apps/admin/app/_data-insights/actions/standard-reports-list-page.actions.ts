import { Action } from '@ngrx/store';

import { StandardReportDetails } from '../models';

export const GET_STANDARD_REPORT_DETAILS = '[Data Insights Management/Standard Reports List Page] Get Standard Reports';
export const GET_STANDARD_REPORT_DETAILS_SUCCESS = '[Data Insights Management/Standard Reports List Page] Get Standard Reports Success';
export const GET_STANDARD_REPORT_DETAILS_ERROR = '[Data Insights Management/Standard Reports List Page] Get Standard Reports Error';
export const SYNC_STANDARD_REPORTS = '[Data Insights Management/Standard Reports List Page] Sync Standard Reports';
export const SYNC_STANDARD_REPORTS_SUCCESS = '[Data Insights Management/Standard Reports List Page] Sync Standard Reports Success';
export const SYNC_STANDARD_REPORTS_ERROR = '[Data Insights Management/Standard Reports List Page] Sync Standard Reports Error';

export class GetStandardReportDetails implements Action {
  readonly type = GET_STANDARD_REPORT_DETAILS;

  constructor() {}
}

export class GetStandardReportDetailsSuccess implements Action {
  readonly type = GET_STANDARD_REPORT_DETAILS_SUCCESS;

  constructor(public payload: StandardReportDetails[]) {}
}

export class GetStandardReportDetailsError implements Action {
  readonly type = GET_STANDARD_REPORT_DETAILS_ERROR;
}

export class SyncStandardReports implements Action {
  readonly type = SYNC_STANDARD_REPORTS;

  constructor() {}
}
export class SyncStandardReportsSuccess implements Action {
  readonly type = SYNC_STANDARD_REPORTS_SUCCESS;

  constructor() {}
}
export class SyncStandardReportsError implements Action {
  readonly type = SYNC_STANDARD_REPORTS_ERROR;

  constructor() {}
}

export type Actions
  = GetStandardReportDetails
  | GetStandardReportDetailsSuccess
  | GetStandardReportDetailsError
  | SyncStandardReports
  | SyncStandardReportsSuccess
  | SyncStandardReportsError;
