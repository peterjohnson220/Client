import { Action } from '@ngrx/store';

import { AvailableJobInformationField } from 'libs/features/jobs/job-description-management/models';

export const LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT =
  '[job-description-management / Job Information Fields] Load Job Information Fields For Bulk Export';
export const LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_ERROR =
  '[job-description-management / Job Information Fields] Load Job Information Fields For Bulk Export Error';
export const LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_SUCCESS =
  '[job-description-management / Job Information Fields] Load Job Information Fields For Bulk Export Success';

export class LoadJobInformationFieldsForBulkExport implements Action {
  readonly type = LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT;

  constructor(public payload: string) {}
}

export class LoadJobInformationFieldsForBulkExportError implements Action {
  readonly type = LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_ERROR;
}

export class LoadJobInformationFieldsForBulkExportSuccess implements Action {
  readonly type = LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_SUCCESS;

  constructor(public payload: AvailableJobInformationField[]) {}
}

export type Actions
  = LoadJobInformationFieldsForBulkExport
  | LoadJobInformationFieldsForBulkExportError
  | LoadJobInformationFieldsForBulkExportSuccess;
