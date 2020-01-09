import { Action } from '@ngrx/store';

import { QueryListStateRequest } from 'libs/models/payfactors-api/job-description/request/query-liststate-request.model';

import { ControlLabel } from '../../shared/models/control-label.model';
import { JobDescriptionBulkExportPayload } from '../models/job-description-bulk-export-payload.model';

export const LOAD_CONTROL_LABELS = '[job-description-management / Bulk Export Popover] Load Control Labels';
export const LOAD_CONTROL_LABELS_ERROR = '[job-description-management / Bulk Export Popover] Load Control Labels Error';
export const LOAD_CONTROL_LABELS_SUCCESS = '[job-description-management / Bulk Export Popover] Load Control Labels Success';
export const LOAD_VIEW_NAMES = '[job-description-management / Bulk Export Popover] Load View Names';
export const LOAD_VIEW_NAMES_ERROR = '[job-description-management / Bulk Export Popover] Load View Names Error';
export const LOAD_VIEW_NAMES_SUCCESS = '[job-description-management / Bulk Export Popover] Load View Names Success';
export const NO_PUBLISHED_JOB_DESCRIPTIONS = '[job-description-management / Bulk Export Popover] No Published Job Descriptions';
export const OPEN_BULK_EXPORT_POPOVER = '[job-description-management / Bulk Export Popover] Open Bulk Export Popover';
export const OPEN_BULK_EXPORT_POPOVER_ERROR = '[job-description-management / Bulk Export Popover] Open Bulk Export Popover Error';
export const BULK_EXPORT = '[job-description-management / Bulk Export Popover] Bulk Export';
export const BULK_EXPORT_SUCCESS = '[job-description-management / Bulk Export Popover] Bulk Export Success';
export const BULK_EXPORT_ERROR = '[job-description-management / Bulk Export Popover] Bulk Export Error';
export const RESET_BULK_EXPORT_ERROR = '[job-description-management / Bulk Export Popover] Bulk Export Error Reset';

export class BulkExport implements Action {
  readonly type = BULK_EXPORT;

  constructor(public payload: JobDescriptionBulkExportPayload) {}
}

export class BulkExportSuccess implements Action {
  readonly type = BULK_EXPORT_SUCCESS;
}

export class BulkExportError implements Action {
  readonly type = BULK_EXPORT_ERROR;

  constructor(public error: any) {}
}

export class ResetBulkExportError implements Action {
  readonly type = RESET_BULK_EXPORT_ERROR;
}

export class LoadControlLabels implements Action {
  readonly type = LOAD_CONTROL_LABELS;

  constructor(public payload: string) {}
}

export class LoadControlLabelsError implements Action {
  readonly type = LOAD_CONTROL_LABELS_ERROR;
}

export class LoadControlLabelsSuccess implements Action {
  readonly type = LOAD_CONTROL_LABELS_SUCCESS;

  constructor(public payload: ControlLabel[]) {}
}

export class LoadViewNames implements Action {
  readonly type = LOAD_VIEW_NAMES;

  constructor(public payload: number) {}
}

export class LoadViewNamesError implements Action {
  readonly type = LOAD_VIEW_NAMES_ERROR;
}

export class LoadViewNamesSuccess implements Action {
  readonly type = LOAD_VIEW_NAMES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class NoPublishedJobDescriptions implements Action {
  readonly type = NO_PUBLISHED_JOB_DESCRIPTIONS;

  constructor() {}
}

export class OpenBulkExportPopover implements Action {
  readonly type = OPEN_BULK_EXPORT_POPOVER;

  constructor(public payload: QueryListStateRequest) {}
}

export class OpenBulkExportPopoverError implements Action {
  readonly type = OPEN_BULK_EXPORT_POPOVER_ERROR;
}

export type Actions
  = LoadControlLabels
  | LoadControlLabelsError
  | LoadControlLabelsSuccess
  | LoadViewNames
  | LoadViewNamesError
  | LoadViewNamesSuccess
  | NoPublishedJobDescriptions
  | OpenBulkExportPopover
  | OpenBulkExportPopoverError
  | BulkExport
  | BulkExportSuccess
  | BulkExportError
  | ResetBulkExportError;
