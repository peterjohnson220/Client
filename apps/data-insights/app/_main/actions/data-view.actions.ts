import { Action } from '@ngrx/store';

import { BaseDataView } from '../../_shared/models';

export const SAVE_USER_REPORT = '[Data Insights / Dashboards] Save User Report';
export const SAVE_USER_REPORT_SUCCESS = '[Data Insights / Dashboards] Save User Report Success';
export const SAVE_USER_REPORT_ERROR = '[Data Insights / Dashboards] Save User Report Error';
export const SAVE_USER_REPORT_CONFLICT_ERROR = '[Data Insights / Dashboards] Save User Report Conflict';

export class SaveUserReport implements Action {
  readonly type = SAVE_USER_REPORT;

  constructor(public payload: BaseDataView) {}
}

export class SaveUserReportSuccess implements Action {
  readonly type = SAVE_USER_REPORT_SUCCESS;

  constructor(public payload: { dataViewId: number }) {}
}

export class SaveUserReportError implements Action {
  readonly type = SAVE_USER_REPORT_ERROR;

  constructor() {}
}

export class SaveUserReportConflict implements Action {
  readonly type = SAVE_USER_REPORT_CONFLICT_ERROR;

  constructor() {}
}

export type Actions
  = SaveUserReport
  | SaveUserReportSuccess
  | SaveUserReportError
  | SaveUserReportConflict;
