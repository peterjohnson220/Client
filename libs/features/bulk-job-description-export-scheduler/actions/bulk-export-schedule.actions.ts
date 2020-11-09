import { Action } from '@ngrx/store';
import { BulkExportSchedule } from 'libs/models/jdm';

export const ADDING_SCHEDULE  = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule';
export const ADDING_SCHEDULE_SUCCESS  = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule Success';
export const ADDING_SCHEDULE_ERROR  = '[Bulk Jobs Export Scheduler Feature / Schedule] Adding Schedule Error';
export const LOADING_SCHEDULE  = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule';
export const LOADING_SCHEDULE_SUCCESS  = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule Success';
export const LOADING_SCHEDULE_ERROR  = '[Bulk Jobs Export Scheduler Feature / Schedule] Loading Schedule Error';
export const REMOVING_SCHEDULE  = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule';
export const REMOVING_SCHEDULE_SUCCESS  = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule Success';
export const REMOVING_SCHEDULE_ERROR  = '[Bulk Jobs Export Scheduler Feature / Schedule] Removing Schedule Error';

export class AddingSchedule implements Action {
  readonly type = ADDING_SCHEDULE;

  constructor(public payload: BulkExportSchedule) { }
}

export class AddingScheduleSuccess implements Action {
  readonly type = ADDING_SCHEDULE_SUCCESS;

   constructor(public payload: any = null) {}
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

export type BulkExportJobsSchedulerActions
  = AddingSchedule
  | AddingScheduleSuccess
  | AddingScheduleError
  | LoadingSchedules
  | LoadingSchedulesSuccess
  | LoadingSchedulesError
  | RemovingSchedule
  | RemovingScheduleError
  | RemovingScheduleSuccess;
