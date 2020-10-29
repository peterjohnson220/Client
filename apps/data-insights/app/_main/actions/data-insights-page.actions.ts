import { Action } from '@ngrx/store';

import { Workbook } from 'libs/features/reports/models';

export const GET_STANDARD_REPORTS = '[Data Insights/Data Insights Page] Get Standard Reports';
export const GET_STANDARD_REPORTS_SUCCESS = '[Data Insights/Data Insights Page] Get Standard Reports Success';
export const GET_STANDARD_REPORTS_ERROR = '[Data Insights/Data Insights Page] Get Standard Reports Error';
export const SAVE_STANDARD_REPORTS_DISPLAY_SETTING = '[Data Insights/Data Insights Page] Save Standard Reports Display Setting';
export const SAVE_STANDARD_REPORTS_DISPLAY_SETTING_SUCCESS =
  '[Data Insights / Data Insights Page] Save Standard Reports Display Setting Success';
export const SAVE_STANDARD_REPORTS_DISPLAY_SETTING_ERROR =
  '[Data Insights / Data Insights Page] Save Standard Reports Display Setting Error';

export class GetStandardReports implements Action {
  readonly type = GET_STANDARD_REPORTS;

  constructor() {}
}

export class GetStandardReportsSuccess implements Action {
  readonly type = GET_STANDARD_REPORTS_SUCCESS;

  constructor(public payload: Workbook[]) {}
}

export class GetStandardReportsError implements Action {
  readonly type = GET_STANDARD_REPORTS_ERROR;
}

export class SaveStandardReportsDisplaySetting implements Action {
  readonly type = SAVE_STANDARD_REPORTS_DISPLAY_SETTING;

  constructor(public payload: { settingValue: boolean }) {}
}

export class SaveStandardReportsDisplaySettingSuccess implements Action {
  readonly type = SAVE_STANDARD_REPORTS_DISPLAY_SETTING_SUCCESS;

  constructor() {}
}

export class SaveStandardReportsDisplaySettingError implements Action {
  readonly type = SAVE_STANDARD_REPORTS_DISPLAY_SETTING_ERROR;

  constructor() {}
}

export type Actions
  = GetStandardReports
  | GetStandardReportsSuccess
  | GetStandardReportsError
  | SaveStandardReportsDisplaySetting
  | SaveStandardReportsDisplaySettingSuccess
  | SaveStandardReportsDisplaySettingError;
