import { Action } from '@ngrx/store';

import {
  CreateProjectRequest,
  ChangeJobStatusRequest,
  DeletePricingRequest,
  UpdatePricingMatchRequest,
  UpdatePricingRequest
} from 'libs/models/payfactors-api';

export const SET_JOBS_PAGE_ID = '[Jobs Page] Set Jobs PageID';
// TODO: Removed HANDLE_API_ERROR and replace it with AsyncStateObj
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';
export const RESET_ERRORS_FOR_MODALS = '[Jobs Page] Reset Errors for Modals';
export const CREATING_PROJECT = '[Jobs Page] Creating Project';
export const CREATING_PROJECT_SUCCESS = '[Jobs Page] Creating Project Success';
export const CREATING_PROJECT_ERROR = '[Jobs Page] Creating Project Error';
export const CHANGING_JOB_STATUS = '[Jobs Page] Changing Job Status';
export const CHANGING_JOB_STATUS_SUCCESS = '[Jobs Page] Changing Job Status Success';
export const CHANGING_JOB_STATUS_ERROR = '[Jobs Page] Changing Job Status Error';
export const DELETING_JOB = '[Jobs Page] Deleting Job';
export const DELETING_JOB_SUCCESS = '[Jobs Page] Deleting Job Success';
export const DELETING_JOB_ERROR = '[Jobs Page] Deleting Job Error';
export const DELETING_PRICING = '[Jobs Page] Deleting Pricing';
export const DELETING_PRICING_SUCCESS = '[Jobs Page] Deleting Pricing Success';
export const DELETING_PRICING_ERROR = '[Jobs Page] Deleting Pricing Error';
export const UPDATING_PRICING = '[Jobs Page] Updating Pricing';
export const UPDATING_PRICING_SUCCESS = '[Jobs Page] Updating Pricing Success';
export const UPDATING_PRICING_ERROR = '[Jobs Page] Updating Pricing Error';
export const DELETING_PRICING_MATCH = '[Jobs Page] Deleting Pricing Match';
export const DELETING_PRICING_MATCH_SUCCESS = '[Jobs Page] Deleting Pricing Match Success';
export const DELETING_PRICING_MATCH_ERROR = '[Jobs Page] Deleting Pricing Match Error';
export const UPDATING_PRICING_MATCH = '[Jobs Page] Updating Pricing Match';
export const UPDATING_PRICING_MATCH_SUCCESS = '[Jobs Page] Updating Pricing Match Success';
export const UPDATING_PRICING_MATCH_ERROR = '[Jobs Page] Updating Pricing Match Error';
export const RECALCULATING_RELATED_PRICINGS = '[Jobs Page] Recalculating Related Pricings';
export const RECALCULATING_RELATED_PRICINGS_SUCCESS = '[Jobs Page] Recalculating Related Pricings Success';
export const RECALCULATING_RELATED_PRICINGS_ERROR = '[Jobs Page] Recalculating Related Pricings Error';
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

export class ShowCreateProjectModal implements Action {
  readonly type = RESET_ERRORS_FOR_MODALS;
  constructor() { }
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

export class ResetErrorsForModals implements Action {
  readonly type = RESET_ERRORS_FOR_MODALS;
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

export class DeletingPricing implements Action {
  readonly type = DELETING_PRICING;
  constructor(public payload: DeletePricingRequest) { }
}

export class DeletingPricingSuccess implements Action {
  readonly type = DELETING_PRICING_SUCCESS;
  constructor() { }
}

export class DeletingPricingError implements Action {
  readonly type = DELETING_PRICING_ERROR;
  constructor(public error: any) { }
}

export class UpdatingPricing implements Action {
  readonly type = UPDATING_PRICING;
  constructor(public request: UpdatePricingRequest, public payfactorsGridPageViewId: string) { }
}

export class UpdatingPricingSuccess implements Action {
  readonly type = UPDATING_PRICING_SUCCESS;
  constructor() { }
}

export class UpdatingPricingError implements Action {
  readonly type = UPDATING_PRICING_ERROR;
  constructor(public error: any) { }
}

export class DeletingPricingMatch implements Action {
  readonly type = DELETING_PRICING_MATCH;
  constructor(public pricingMatchId: number) { }
}

export class DeletingPricingMatchSuccess implements Action {
  readonly type = DELETING_PRICING_MATCH_SUCCESS;
  constructor() { }
}

export class DeletingPricingMatchError implements Action {
  readonly type = DELETING_PRICING_MATCH_ERROR;
  constructor(public error: any) { }
}

export class UpdatingPricingMatch implements Action {
  readonly type = UPDATING_PRICING_MATCH;
  constructor(public request: UpdatePricingMatchRequest, public pricingId: number, public matchesGridPageViewId: string) { }
}

export class UpdatingPricingMatchSuccess implements Action {
  readonly type = UPDATING_PRICING_MATCH_SUCCESS;
  constructor() { }
}

export class UpdatingPricingMatchError implements Action {
  readonly type = UPDATING_PRICING_MATCH_ERROR;
  constructor(public error: any) { }
}

export class RecalculatingRelatedPricings implements Action {
  readonly type = RECALCULATING_RELATED_PRICINGS;
  constructor(public pricingId: number) { }
}

export class RecalculatingRelatedPricingsSuccess implements Action {
  readonly type = RECALCULATING_RELATED_PRICINGS_SUCCESS;
  constructor() { }
}

export class RecalculatingRelatedPricingsError implements Action {
  readonly type = RECALCULATING_RELATED_PRICINGS_ERROR;
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
  | ShowCreateProjectModal
  | CreatingProject
  | CreatingProjectSuccess
  | CreatingProjectError
  | ResetErrorsForModals
  | ChangingJobStatus
  | ChangingJobStatusSuccess
  | ChangingJobStatusError
  | DeletingJob
  | DeletingJobSuccess
  | DeletingJobError
  | DeletingPricing
  | DeletingPricingSuccess
  | DeletingPricingError
  | UpdatingPricing
  | UpdatingPricingSuccess
  | UpdatingPricingError
  | DeletingPricingMatch
  | DeletingPricingMatchSuccess
  | DeletingPricingMatchError
  | UpdatingPricingMatch
  | UpdatingPricingMatchSuccess
  | UpdatingPricingMatchError
  | RecalculatingRelatedPricings
  | RecalculatingRelatedPricingsSuccess
  | RecalculatingRelatedPricingsError
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
