import { Action } from '@ngrx/store';

import { TabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';

export const GET_SAVED_SCHEDULES = '[Data Insights / Schedule Export Modal] Get Saved Schedules';
export const GET_SAVED_SCHEDULES_SUCCESS = '[Data Insights / Schedule Export Modal] Get Saved Schedules Success';
export const GET_SAVED_SCHEDULES_ERROR = '[Data Insights / Schedule Export Modal] Get Saved Schedules Error';
export const SAVE_SCHEDULE = '[Data Insights / Schedule Export Modal] Save Schedule';
export const SAVE_SCHEDULE_SUCCESS = '[Data Insights / Schedule Export Modal] Save Schedule Success';
export const SAVE_SCHEDULE_ERROR = '[Data Insights / Schedule Export Modal] Save Schedule Error';
export const DELETE_EXPORT_SCHEDULE = '[Data Insights / Schedule Export Modal] Delete Export Schedule ';
export const DELETE_EXPORT_SCHEDULE_SUCCESS = '[Data Insights / Schedule Export Modal] Delete Export Schedule Success';
export const DELETE_EXPORT_SCHEDULE_ERROR = '[Data Insights / Schedule Export Modal] Delete Export Schedule Error';
export const UPDATE_EXPORT_SCHEDULE = '[Data Insights / Schedule Export Modal] Update Export Schedule';
export const UPDATE_EXPORT_SCHEDULE_SUCCESS = '[Data Insights / Schedule Export Modal] Update Export Schedule Success';
export const UPDATE_EXPORT_SCHEDULE_ERROR = '[Data Insights / Schedule Export Modal] Update Export Schedule Error';


export class GetSavedSchedules implements Action {
  readonly type = GET_SAVED_SCHEDULES;
  constructor() {}
}

export class GetSavedSchedulesSuccess implements Action {
  readonly type = GET_SAVED_SCHEDULES_SUCCESS;
  constructor(public payload: TabularReportExportSchedule[]) {}
}

export class GetSavedSchedulesError implements Action {
  readonly type = GET_SAVED_SCHEDULES_ERROR;
  constructor() {}
}

export class SaveSchedule implements Action {
  readonly type = SAVE_SCHEDULE;
  constructor(public payload: TabularReportExportSchedule) {}
}

export class SaveScheduleSuccess implements Action {
  readonly type = SAVE_SCHEDULE_SUCCESS;
  constructor() {}
}

export class SaveScheduleError implements Action {
  readonly type = SAVE_SCHEDULE_ERROR;
  constructor() {}
}

export class DeleteExportSchedule implements Action {
  readonly type = DELETE_EXPORT_SCHEDULE;
  constructor(public payload: number) {}
}

export class DeleteExportScheduleSuccess implements Action {
  readonly type = DELETE_EXPORT_SCHEDULE_SUCCESS;
  constructor(public payload: number) {}
}

export class DeleteExportScheduleError implements Action {
  readonly type = DELETE_EXPORT_SCHEDULE_ERROR;
  constructor() {}
}

export class UpdateExportSchedule implements Action {
  readonly type = UPDATE_EXPORT_SCHEDULE;
  constructor(public payload: TabularReportExportSchedule) {}
}

export class UpdateExportScheduleSuccess implements Action {
  readonly type = UPDATE_EXPORT_SCHEDULE_SUCCESS;
  constructor() {}
}

export class UpdateExportScheduleError implements Action {
  readonly type = UPDATE_EXPORT_SCHEDULE_ERROR;
  constructor() {}
}

export type Actions
  = GetSavedSchedules
  | GetSavedSchedulesSuccess
  | GetSavedSchedulesError
  | SaveSchedule
  | SaveScheduleSuccess
  | SaveScheduleError
  | UpdateExportSchedule
  | UpdateExportScheduleSuccess
  | UpdateExportScheduleError
  | DeleteExportSchedule
  | DeleteExportScheduleSuccess
  | DeleteExportScheduleError;
