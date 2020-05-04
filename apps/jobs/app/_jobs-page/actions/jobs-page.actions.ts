import { Action } from '@ngrx/store';

import { CreateProjectRequest, ChangeJobStatusRequest, DeletePricingRequest } from 'libs/models/payfactors-api';

export const SET_JOBS_PAGE_ID = '[Jobs Page] Set Jobs PageID';
// TODO: Removed HANDLE_API_ERROR and replace it with AsyncStateObj
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';
export const SHOW_CREATE_PROJECT_MODAL = '[Jobs Page] Show Create Project Modal';
export const CREATING_PROJECT = '[Jobs Page] Creating Project';
export const CREATING_PROJECT_SUCCESS = '[Jobs Page] Creating Project Success';
export const CREATING_PROJECT_ERROR = '[Jobs Page] Creating Project Error';
export const SHOW_JOB_STATUS_MODAL = '[Jobs Page] Show Job Status Modal';
export const CHANGING_JOB_STATUS = '[Jobs Page] Changing Job Status';
export const CHANGING_JOB_STATUS_SUCCESS = '[Jobs Page] Changing Job Status Success';
export const CHANGING_JOB_STATUS_ERROR = '[Jobs Page] Changing Job Status Error';
export const SHOW_DELETE_JOB_MODAL = '[Jobs Page] Show Delete Job Modal';
export const DELETING_JOB = '[Jobs Page] Deleting Job';
export const DELETING_JOB_SUCCESS = '[Jobs Page] Deleting Job Success';
export const DELETING_JOB_ERROR = '[Jobs Page] Deleting Job Error';
export const CONFIRM_DELETE_PRICING_FROM_GRID = '[Jobs Page] Confirm Delete Pricing From Grid';
export const DELETE_PRICING_FROM_GRID = '[Jobs Page] Delete Pricing From Grid';
export const DELETE_PRICING_SUCCESS = '[Jobs Page] Delete Pricing Success';
export const CANCEL_DELETE_PRICING = '[Jobs Page] Cancel Delete Pricing';
export const LOAD_COMPANY_PAYMARKETS = '[Jobs Page] Load Company PayMarket';
export const LOAD_COMPANY_PAYMARKETS_SUCCESS = '[Jobs Page] Load Company PayMarket Success';
export const LOAD_STRUCTURE_GRADES = '[Jobs Page] Load Structure Grades';
export const LOAD_STRUCTURE_GRADES_SUCCESS = '[Jobs Page] Load Structure Grades Success';
export const CHANGE_PRICING_DETAILS_VIEW = '[Jobs Page] Change Pricing Details View';
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
  constructor(public payload: string) {}
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export class ShowCreateProjectModal implements Action {
  readonly type = SHOW_CREATE_PROJECT_MODAL;
  constructor() {}
}

export class CreatingProject implements Action {
  readonly type = CREATING_PROJECT;
  constructor(public payload: CreateProjectRequest) {}
}

export class CreatingProjectSuccess implements Action {
  readonly type = CREATING_PROJECT_SUCCESS;
  constructor() {}
}

export class CreatingProjectError implements Action {
  readonly type = CREATING_PROJECT_ERROR;
  constructor(public error: any) {}
}

export class ShowJobStatusModal implements Action {
  readonly type = SHOW_JOB_STATUS_MODAL;
  constructor() {}
}

export class ChangingJobStatus implements Action {
  readonly type = CHANGING_JOB_STATUS;
  constructor(public payload: ChangeJobStatusRequest) {}
}

export class ChangingJobStatusSuccess implements Action {
  readonly type = CHANGING_JOB_STATUS_SUCCESS;
  constructor() {}
}

export class ChangingJobStatusError implements Action {
  readonly type = CHANGING_JOB_STATUS_ERROR;
  constructor(public error: any) {}
}

export class ShowDeleteJobModal implements Action {
  readonly type = SHOW_DELETE_JOB_MODAL;
  constructor() {}
}

export class DeletingJob implements Action {
  readonly type = DELETING_JOB;
  constructor(public payload: number) {}
}

export class DeletingJobSuccess implements Action {
  readonly type = DELETING_JOB_SUCCESS;
  constructor() {}
}

export class DeletingJobError implements Action {
  readonly type = DELETING_JOB_ERROR;
  constructor(public error: any) {}
}

export class ConfirmDeletePricingFromGrid implements Action {
  readonly type = CONFIRM_DELETE_PRICING_FROM_GRID;
  constructor(public payload: DeletePricingRequest) { }
}

export class DeletePricingFromGrid implements Action {
  readonly type = DELETE_PRICING_FROM_GRID;
  constructor(public pageViewId: string, public payload: DeletePricingRequest) {}
}

export class DeletePricingSuccess implements Action {
  readonly type = DELETE_PRICING_SUCCESS;
  constructor() { }
}

export class CancelDeletePricing implements Action {
  readonly type = CANCEL_DELETE_PRICING;
  constructor() {}
}
export class LoadCompanyPayMarkets implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS;
  constructor() {}
}
export class LoadCompanyPayMarketsSuccess implements Action {
  readonly type = LOAD_COMPANY_PAYMARKETS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadStructureGrades implements Action {
  readonly type = LOAD_STRUCTURE_GRADES;
  constructor() {}
}

export class LoadStructureGradesSuccess implements Action {
  readonly type = LOAD_STRUCTURE_GRADES_SUCCESS;
  constructor(public payload: string[]) {}
}

export class ChangePricingDetailsView implements Action {
  readonly type = CHANGE_PRICING_DETAILS_VIEW;
  constructor(public payload: string) {}
}

export class ExportPricings implements Action {
  readonly type = EXPORT_PRICINGS;
  constructor(public payload: any) {}
}

export class ExportPricingsSuccess implements Action {
  readonly type = EXPORT_PRICINGS_SUCCESS;
  constructor(public payload: any) {}
}

export class ExportPricingsError implements Action {
  readonly type = EXPORT_PRICINGS_ERROR;
  constructor(public payload: any) {}
}

export class LoadCustomExports implements Action {
  readonly type = LOAD_CUSTOM_EXPORTS;
  constructor() {}
}

export class LoadCustomExportsSuccess implements Action {
  readonly type = LOAD_CUSTOM_EXPORTS_SUCCESS;
  constructor(public payload: any) {}
}

export class ToggleJobsPage implements Action {
  readonly type = TOGGLE_JOBS_PAGE;
  constructor() {}
}

export class ToggleJobsPageSuccess implements Action {
  readonly type = TOGGLE_JOBS_PAGE_SUCCESS;
  constructor() {}
}

export class ToggleJobsPageError implements Action {
  readonly type = TOGGLE_JOBS_PAGE_ERROR;
  constructor() {}
}

export type JobsPageActions
  = SetJobsPageId
  | HandleApiError
  | ShowCreateProjectModal
  | CreatingProject
  | CreatingProjectSuccess
  | CreatingProjectError
  | ShowJobStatusModal
  | ChangingJobStatus
  | ChangingJobStatusSuccess
  | ChangingJobStatusError
  | ConfirmDeletePricingFromGrid
  | ShowDeleteJobModal
  | DeletingJob
  | DeletingJobSuccess
  | DeletingJobError
  | ConfirmDeletePricingFromGrid
  | DeletePricingFromGrid
  | DeletePricingSuccess
  | CancelDeletePricing
  | LoadCompanyPayMarkets
  | LoadCompanyPayMarketsSuccess
  | LoadStructureGrades
  | LoadStructureGradesSuccess
  | ChangePricingDetailsView
  | ExportPricings
  | ExportPricingsSuccess
  | ExportPricingsError
  | LoadCustomExports
  | LoadCustomExportsSuccess
  | ToggleJobsPage
  | ToggleJobsPageSuccess
  | ToggleJobsPageError;
