import { Action} from '@ngrx/store';
import {TransferScheduleSummary, SyncScheduleDtoModel} from 'libs/models/hris-api/sync-schedule';

export const GET_TRANSFER_SUMMARY = '[Data Management / Transfer Schedule] Load Transfer Schedule Summary';
export const GET_TRANSFER_SUMMARY_ERROR = '[Data Management / Transfer Schedule] Load Transfer Schedule Summary Error';
export const GET_TRANSFER_SUMMARY_SUCCESS = '[Data Management / Transfer Schedule] Load Transfer Schedule Summary Success';

export const DISABLE_TRANSFER_SCHEDULE = '[Data Management / Transfer Schedule] Disable Transfer Schedule';
export const DISABLE_TRANSFER_SCHEDULE_ERROR = '[Data Management / Transfer Schedule] Disable Transfer Schedule Error';
export const DISABLE_TRANSFER_SCHEDULE_SUCCESS = '[Data Management / Transfer Schedule] Disable Transfer Schedule Success';

export const ENABLE_TRANSFER_SCHEDULE = '[Data Management / Transfer Schedule] Enable Transfer Schedule';
export const ENABLE_TRANSFER_SCHEDULE_ERROR = '[Data Management / Transfer Schedule] Enable Transfer Schedule Error';
export const ENABLE_TRANSFER_SCHEDULE_SUCCESS = '[Data Management / Transfer Schedule] Enable Transfer Schedule Success';

export const SAVE_TRANSFER_SCHEDULE = '[Data Management / Transfer Schedule] Save Transfer Schedule';
export const SAVE_TRANSFER_SCHEDULE_ERROR = '[Data Management / Transfer Schedule] Save Transfer Schedule Error';
export const SAVE_TRANSFER_SCHEDULE_SUCCESS = '[Data Management / Transfer Schedule] Save Transfer Schedule Success';

export const SAVE_ALL_TRANSFER_SCHEDULES = '[Data Management / Transfer Schedule] Save All Transfer Schedules';
export const SAVE_ALL_TRANSFER_SCHEDULES_ERROR = '[Data Management / Transfer Schedule] Save All Transfer Schedules Error';
export const SAVE_ALL_TRANSFER_SCHEDULES_SUCCESS = '[Data Management / Transfer Schedule] Save All Transfer Schedules Success';

export const SHOW_INTEGRATION_SETUP_COMPLETED_MODAL = '[Data Management / Transfer Schedule] Show Setup Integration Complete Modal';

export class GetTransferSummary implements Action {
  readonly type = GET_TRANSFER_SUMMARY;
}
export class GetTransferSummaryError implements Action {
  readonly type = GET_TRANSFER_SUMMARY_ERROR;
}
export class GetTransferSummarySuccess implements Action {
  readonly type = GET_TRANSFER_SUMMARY_SUCCESS;

  constructor(public payload: TransferScheduleSummary[]) {}
}

export class DisableTransferSchedule implements Action {
  readonly type = DISABLE_TRANSFER_SCHEDULE;

  constructor(public payload: number) {}
}

export class DisableTransferScheduleError implements Action {
  readonly type = DISABLE_TRANSFER_SCHEDULE_ERROR;
}

export class DisableTransferScheduleSuccess implements Action {
  readonly type = DISABLE_TRANSFER_SCHEDULE_SUCCESS;
}

export class EnableTransferSchedule implements Action {
  readonly type = ENABLE_TRANSFER_SCHEDULE;

  constructor(public payload: number) {}
}

export class EnableTransferScheduleError implements Action {
  readonly type = ENABLE_TRANSFER_SCHEDULE_ERROR;
}

export class EnableTransferScheduleSuccess implements Action {
  readonly type = ENABLE_TRANSFER_SCHEDULE_SUCCESS;
}

export class SaveTransferSchedule implements Action {
  readonly type = SAVE_TRANSFER_SCHEDULE;

  constructor(public payload: SyncScheduleDtoModel) {}
}

export class SaveTransferScheduleError implements Action {
  readonly type = SAVE_TRANSFER_SCHEDULE_ERROR;
}

export class SaveTransferScheduleSuccess implements Action {
  readonly type = SAVE_TRANSFER_SCHEDULE_SUCCESS;

  constructor(public payload: TransferScheduleSummary) {}
}

export class SaveAllTransferSchedules implements Action {
  readonly type = SAVE_ALL_TRANSFER_SCHEDULES;

  constructor(public payload: {schedules: SyncScheduleDtoModel[]; route: string }) {}
}

export class SaveAllTransferSchedulesError implements Action {
  readonly type = SAVE_ALL_TRANSFER_SCHEDULES_ERROR;
}

export class SaveAllTransferSchedulesSuccess implements Action {
  readonly type = SAVE_ALL_TRANSFER_SCHEDULES_SUCCESS;

  constructor(public payload: {summary: TransferScheduleSummary[]; route: string}) {}
}

export class ShowIntegrationSetupCompletedModal implements Action {
  readonly type = SHOW_INTEGRATION_SETUP_COMPLETED_MODAL;

  constructor(public payload: boolean) {}
}

export type Actions
  = GetTransferSummary
  | GetTransferSummaryError
  | GetTransferSummarySuccess
  | DisableTransferSchedule
  | DisableTransferScheduleError
  | DisableTransferScheduleSuccess
  | EnableTransferSchedule
  | EnableTransferScheduleError
  | EnableTransferScheduleSuccess
  | SaveAllTransferSchedules
  | SaveAllTransferSchedulesError
  | SaveAllTransferSchedulesSuccess
  | SaveTransferSchedule
  | SaveTransferScheduleError
  | SaveTransferScheduleSuccess
  | ShowIntegrationSetupCompletedModal;
