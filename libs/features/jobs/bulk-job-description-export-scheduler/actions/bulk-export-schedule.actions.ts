import { Action } from '@ngrx/store';
import { BulkExportHistory, BulkExportSchedule, BulkExportScheduleParameters } from 'libs/models/jdm';

export const ADDING_SCHEDULE = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule';
export const ADDING_SCHEDULE_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule Success';
export const ADDING_SCHEDULE_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule Error';
export const LOADING_SCHEDULE = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule';
export const LOADING_SCHEDULE_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule Success';
export const LOADING_SCHEDULE_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule Error';
export const REMOVING_SCHEDULE = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule';
export const REMOVING_SCHEDULE_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule Success';
export const REMOVING_SCHEDULE_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule Error';
export const CLOSE_SCHEDULE_MODAL = '[Bulk Jobs Export Scheduler Feature / Schedule] Close Schedule Modal';
export const OPEN_SCHEDULE_MODAL = '[Bulk Jobs Export Scheduler Feature / Schedule] Open Schedule Modal';
export const EDIT_SCHEDULE = '[Bulk Jobs Export Scheduler Feature / Schedule] Edit Schedule';
export const UPDATE_SCHEDULE = '[Bulk Jobs Export Scheduler Feature / Schedule] Update Schedule';
export const UPDATE_SCHEDULE_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Update Schedule Success';
export const UPDATE_SCHEDULE_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Update Schedule Error';
export const GET_JDM_EXPORT_URL = '[Bulk Jobs Export Scheduler Feature / Schedule] Get JDM Export URL';
export const GET_JDM_EXPORT_URL_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Get JDM Export URL Success';
export const GET_JDM_EXPORT_URL_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Get JDM Export URL Error';
export const GET_LATEST_EXPORT_HISTORY = '[Bulk Jobs Export Scheduler Feature / Schedule] Get Export History';
export const GET_LATEST_EXPORT_HISTORY_ERROR = '[Bulk Jobs Export Scheduler Feature / Schedule] Get Export History Error';
export const GET_LATEST_EXPORT_HISTORY_SUCCESS = '[Bulk Jobs Export Scheduler Feature / Schedule] Get Export History Success';

export class AddingSchedule implements Action {
  readonly type = ADDING_SCHEDULE;

  constructor(public payload: BulkExportSchedule) { }
}

export class AddingScheduleSuccess implements Action {
  readonly type = ADDING_SCHEDULE_SUCCESS;

   constructor(public payload: string) {}
}

export class AddingScheduleError implements Action {
  readonly type = ADDING_SCHEDULE_ERROR;

   constructor(public payload: any = null) {}
}

export class LoadingSchedules implements Action {
  readonly type = LOADING_SCHEDULE;

  constructor(public payload: any = null) {}
}

export class LoadingSchedulesSuccess implements Action {
  readonly type = LOADING_SCHEDULE_SUCCESS;

  constructor(public payload: BulkExportSchedule[]) {}
}

export class LoadingSchedulesError implements Action {
  readonly type = LOADING_SCHEDULE_ERROR;

  constructor(public payload: any) {}
}

export class RemovingSchedule implements Action {
  readonly type = REMOVING_SCHEDULE;

  constructor(public payload: string) { }
}

export class RemovingScheduleSuccess implements Action {
  readonly type = REMOVING_SCHEDULE_SUCCESS;

  constructor(public payload: any = null) {}
}

export class RemovingScheduleError implements Action {
  readonly type = REMOVING_SCHEDULE_ERROR;

  constructor(public payload: any = null) {}
}

export class CloseScheduleModal implements Action {
  readonly type = CLOSE_SCHEDULE_MODAL;

  constructor() {}
}

export class OpenScheduleModal implements Action {
  readonly type = OPEN_SCHEDULE_MODAL;

  constructor() {}
}

export class EditSchedule implements Action {
  readonly type = EDIT_SCHEDULE;

  constructor(public payload: BulkExportSchedule) { }
}

export class UpdateSchedule implements Action {
  readonly type = UPDATE_SCHEDULE;

  constructor(public payload: BulkExportScheduleParameters) { }
}

export class UpdateScheduleSuccess implements Action {
  readonly type = UPDATE_SCHEDULE_SUCCESS;

   constructor(public payload: any = null) {}
}

export class UpdateScheduleError implements Action {
  readonly type = UPDATE_SCHEDULE_ERROR;

   constructor(public payload: any = null) {}
}

export class GetJdmExportUrl implements Action {
  readonly type = GET_JDM_EXPORT_URL;

   constructor(public payload: string) {}
}

export class GetJdmExportUrlSuccess implements Action {
  readonly type = GET_JDM_EXPORT_URL_SUCCESS;

   constructor(public payload: string) {}
}

export class GetJdmExportUrlError implements Action {
  readonly type = GET_JDM_EXPORT_URL_ERROR;

   constructor() {}
}

export class GetLatestExportsHistory implements Action {
  readonly type = GET_LATEST_EXPORT_HISTORY;

  constructor() {}
}
export class GetLatestExportsHistorySuccess implements Action {
  readonly type = GET_LATEST_EXPORT_HISTORY_SUCCESS;

  constructor(public payload: BulkExportHistory[]) {}
}
export class GetLatestExportsHistoryError implements Action {
  readonly type = GET_LATEST_EXPORT_HISTORY_ERROR;

  constructor() {}
}

export type BulkExportJobsSchedulerActions
  = AddingSchedule
  | AddingScheduleSuccess
  | AddingScheduleError
  | LoadingSchedules
  | LoadingSchedulesSuccess
  | LoadingSchedulesError
  | RemovingSchedule
  | RemovingScheduleError
  | RemovingScheduleSuccess
  | CloseScheduleModal
  | OpenScheduleModal
  | EditSchedule
  | UpdateSchedule
  | UpdateScheduleSuccess
  | UpdateScheduleError
  | GetJdmExportUrl
  | GetJdmExportUrlSuccess
  | GetJdmExportUrlError
  | GetLatestExportsHistory
  | GetLatestExportsHistorySuccess
  | GetLatestExportsHistoryError;
