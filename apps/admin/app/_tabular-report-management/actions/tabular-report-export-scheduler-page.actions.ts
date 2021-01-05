import { Action } from '@ngrx/store';

import { Workbook, TabularReportExportSchedule } from 'libs/features/reports/models';

export const GET_TABULAR_REPORTS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports';
export const GET_TABULAR_REPORTS_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports Success';
export const GET_TABULAR_REPORTS_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Tabular Reports Error';
export const GET_SAVED_SCHEDULES = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Saved Schedules';
export const GET_SAVED_SCHEDULES_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Saved Schedules Success';
export const GET_SAVED_SCHEDULES_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Get Saved Schedules Error';
export const SAVE_SCHEDULE = '[Tabular Report Management/Tabular Report Export Scheduler Page] Save Schedule';
export const SAVE_SCHEDULE_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Save Schedule Success';
export const SAVE_SCHEDULE_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Save Schedule Error';
export const SHOW_DELETE_MODAL = '[Tabular Report Management/Tabular Report Export Scheduler Page] Show Delete Modal';
export const DELETE_EXPORT_SCHEDULE = '[Tabular Report Management/Tabular Report Export Scheduler Page] Delete Export Schedule ';
export const DELETE_EXPORT_SCHEDULE_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Delete Export Schedule Success';
export const DELETE_EXPORT_SCHEDULE_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Delete Export Schedule Error';
export const UPDATE_EXPORT_SCHEDULE = '[Tabular Report Management/Tabular Report Export Scheduler Page] Update Export Schedule';
export const UPDATE_EXPORT_SCHEDULE_SUCCESS = '[Tabular Report Management/Tabular Report Export Scheduler Page] Update Export Schedule Success';
export const UPDATE_EXPORT_SCHEDULE_ERROR = '[Tabular Report Management/Tabular Report Export Scheduler Page] Update Export Schedule Error';

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

export class ShowDeleteModal implements Action {
  readonly type = SHOW_DELETE_MODAL;
  constructor(public payload: boolean) { }
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
  constructor(public payload: TabularReportExportSchedule) {}
}

export class UpdateExportScheduleError implements Action {
  readonly type = UPDATE_EXPORT_SCHEDULE_ERROR;
  constructor() {}
}

export type Actions
  = GetTabularReports
  | GetTabularReportsSuccess
  | GetTabularReportsError
  | GetSavedSchedules
  | GetSavedSchedulesSuccess
  | GetSavedSchedulesError
  | SaveSchedule
  | SaveScheduleSuccess
  | SaveScheduleError
  | ShowDeleteModal
  | DeleteExportSchedule
  | DeleteExportScheduleSuccess
  | DeleteExportScheduleError
  | UpdateExportSchedule
  | UpdateExportScheduleSuccess
  | UpdateExportScheduleError;
