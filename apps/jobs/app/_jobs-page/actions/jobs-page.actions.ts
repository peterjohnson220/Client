import { Action } from '@ngrx/store';

import { CreateProjectRequest, ChangeJobStatusRequest } from 'libs/models/payfactors-api';

export const SET_JOBS_PAGE_ID = '[Jobs Page] Set Jobs PageID';
// TODO: Removed HANDLE_API_ERROR and replace it with AsyncStateObj
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';
export const RESET_JOBS_PAGE_MODALS = '[Jobs Page] Reset Jobs Page Modals';
export const CREATING_PROJECT = '[Jobs Page] Creating Project';
export const CREATING_PROJECT_SUCCESS = '[Jobs Page] Creating Project Success';
export const CREATING_PROJECT_ERROR = '[Jobs Page] Creating Project Error';
export const CHANGING_JOB_STATUS = '[Jobs Page] Changing Job Status';
export const CHANGING_JOB_STATUS_SUCCESS = '[Jobs Page] Changing Job Status Success';
export const CHANGING_JOB_STATUS_ERROR = '[Jobs Page] Changing Job Status Error';
export const DELETING_JOB = '[Jobs Page] Deleting Job';
export const DELETING_JOB_SUCCESS = '[Jobs Page] Deleting Job Success';
export const DELETING_JOB_ERROR = '[Jobs Page] Deleting Job Error';
export const LOAD_COMPANY_PAYMARKETS = '[Jobs Page] Load Company PayMarket';
export const LOAD_COMPANY_PAYMARKETS_SUCCESS = '[Jobs Page] Load Company PayMarket Success';
export const LOAD_STRUCTURE_GRADES = '[Jobs Page] Load Structure Grades';
export const LOAD_STRUCTURE_GRADES_SUCCESS = '[Jobs Page] Load Structure Grades Success';
export const EXPORT_PRICINGS = '[Jobs Page] Export Pricings';
export const EXPORT_PRICINGS_SUCCESS = '[Jobs Page] Export Pricings Success';
export const EXPORT_PRICINGS_ERROR = '[Jobs Page] Export Pricings Error';
export const LOAD_CUSTOM_EXPORTS = '[Jobs Page] Load Custom Exports';
export const LOAD_CUSTOM_EXPORTS_SUCCESS = '[Jobs Page] Load Custom Exports Success';
export const TOGGLE_JOBS_PAGE = '[Jobs Page] Toggle Jobs Page';
export const TOGGLE_JOBS_PAGE_SUCCESS = '[Jobs Page] Toggle Jobs Page Success';
export const TOGGLE_JOBS_PAGE_ERROR = '[Jobs Page] Toggle Jobs Page Error';

export class SetJobsPageId implements Action {
  readonly type = SET_JOBS_PAGE_ID;
  constructor(public payload: string) { }
}

export class HandleApiError implements Action {
  readonly type = HANDLE_API_ERROR;
  constructor(public payload: string) { }
}

export class CreatingProject implements Action {
  readonly type = CREATING_PROJECT;
  constructor(public payload: CreateProjectRequest) { }
}

export class CreatingProjectSuccess implements Action {
  readonly type = CREATING_PROJECT_SUCCESS;
  constructor() { }
}

export class CreatingProjectError implements Action {
  readonly type = CREATING_PROJECT_ERROR;
  constructor(public error: any) { }
}

export class ResetJobsPageModals implements Action {
  readonly type = RESET_JOBS_PAGE_MODALS;
  constructor() { }
}

export class ChangingJobStatus implements Action {
  readonly type = CHANGING_JOB_STATUS;
  constructor(public payload: ChangeJobStatusRequest) { }
}

export class ChangingJobStatusSuccess implements Action {
  readonly type = CHANGING_JOB_STATUS_SUCCESS;
  constructor() { }
}

export class ChangingJobStatusError implements Action {
  readonly type = CHANGING_JOB_STATUS_ERROR;
  constructor(public error: any) { }
}

export class DeletingJob implements Action {
  readonly type = DELETING_JOB;
  constructor(public payload: number) { }
}

export class DeletingJobSuccess implements Action {
  readonly type = DELETING_JOB_SUCCESS;
  constructor() { }
}

export class DeletingJobError implements Action {
  readonly type = DELETING_JOB_ERROR;
  constructor(public error: any) { }
}

export class LoadCompanyPayMarkets implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS;
  constructor() { }
}
export class LoadCompanyPayMarketsSuccess implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadStructureGrades implements Action {
  readonly type = LOAD_STRUCTURE_GRADES;
  constructor() { }
}

export class LoadStructureGradesSuccess implements Action {
  readonly type = LOAD_STRUCTURE_GRADES_SUCCESS;
  constructor(public payload: string[]) { }
}

export class ExportPricings implements Action {
  readonly type = EXPORT_PRICINGS;
  constructor(public payload: any) { }
}

export class ExportPricingsSuccess implements Action {
  readonly type = EXPORT_PRICINGS_SUCCESS;
  constructor(public payload: any) { }
}

export class ExportPricingsError implements Action {
  readonly type = EXPORT_PRICINGS_ERROR;
  constructor(public payload: any) { }
}

export class LoadCustomExports implements Action {
  readonly type = LOAD_CUSTOM_EXPORTS;
  constructor() { }
}

export class LoadCustomExportsSuccess implements Action {
  readonly type = LOAD_CUSTOM_EXPORTS_SUCCESS;
  constructor(public payload: any) { }
}

export class ToggleJobsPage implements Action {
  readonly type = TOGGLE_JOBS_PAGE;
  constructor() { }
}

export class ToggleJobsPageSuccess implements Action {
  readonly type = TOGGLE_JOBS_PAGE_SUCCESS;
  constructor() { }
}

export class ToggleJobsPageError implements Action {
  readonly type = TOGGLE_JOBS_PAGE_ERROR;
  constructor() { }
}

export type JobsPageActions
  = SetJobsPageId
  | HandleApiError
  | CreatingProject
  | CreatingProjectSuccess
  | CreatingProjectError
  | ResetJobsPageModals
  | ChangingJobStatus
  | ChangingJobStatusSuccess
  | ChangingJobStatusError
  | DeletingJob
  | DeletingJobSuccess
  | DeletingJobError
  | LoadCompanyPayMarkets
  | LoadCompanyPayMarketsSuccess
  | LoadStructureGrades
  | LoadStructureGradesSuccess
  | ExportPricings
  | ExportPricingsSuccess
  | ExportPricingsError
  | LoadCustomExports
  | LoadCustomExportsSuccess
  | ToggleJobsPage
  | ToggleJobsPageSuccess
  | ToggleJobsPageError;
