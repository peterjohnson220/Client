import { Action } from '@ngrx/store';

import { AddToProjectRequest, ChangeJobStatusRequest, DeletePricingRequest } from 'libs/models/payfactors-api';

export const SET_JOBS_PAGE_ID = '[Jobs Page] Set Jobs PageID';
export const LOAD_COMPANY = '[Jobs Page] Load Company';
export const LOAD_COMPANY_ERROR = '[Jobs Page] Load Company Error';
export const LOAD_COMPANY_SUCCESS = '[Jobs Page] Load Company Success';
// TODO: Removed HANDLE_API_ERROR and replace it with AsyncStateObj
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';
export const SHOW_ADD_TO_PROJECT_MODAL = '[Jobs Page] Show Add To Project Modal';
export const ADDING_TO_PROJECT = '[Jobs Page] Adding To Project';
export const ADDING_TO_PROJECT_SUCCESS = '[Jobs Page] Adding To Project Success';
export const ADDING_TO_PROJECT_ERROR = '[Jobs Page] Adding To Project Error';
export const SHOW_JOB_STATUS_MODAL = '[Jobs Page] Show Job Status Modal';
export const CHANGING_JOB_STATUS = '[Jobs Page] Changing Job Status';
export const CHANGING_JOB_STATUS_SUCCESS = '[Jobs Page] Changing Job Status Success';
export const CHANGING_JOB_STATUS_ERROR = '[Jobs Page] Changing Job Status Error';
export const CONFIRM_DELETE_PRICING_FROM_GRID = '[Jobs Page] Confirm Delete Pricing From Grid';
export const DELETE_PRICING_FROM_GRID = '[Jobs Page] Delete Pricing From Grid';
export const DELETE_PRICING_SUCCESS = '[Jobs Page] Delete Pricing Success';
export const CANCEL_DELETE_PRICING = '[Jobs Page] Cancel Delete Pricing';
export const LOAD_COMPANY_PAYMARKETS = '[Jobs Page] Load Company PayMarket';
export const LOAD_COMPANY_PAYMARKETS_SUCCESS = '[Jobs Page] Load Company PayMarket Success';


export class SetJobsPageId implements Action {
  readonly type = SET_JOBS_PAGE_ID;
  constructor(public payload: string) {}
}

export class LoadCompany implements Action {
  readonly type = LOAD_COMPANY;
  constructor() {}
}

export class LoadCompanySuccess implements Action {
  readonly type = LOAD_COMPANY_SUCCESS;
  constructor(public payload: string) {}
}

export class LoadCompanyError implements Action {
  readonly type = LOAD_COMPANY_ERROR;
  constructor() {}
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export class ShowAddToProjectModal implements Action {
  readonly type = SHOW_ADD_TO_PROJECT_MODAL;
  constructor(public payload: boolean) {}
}

export class AddingToProject implements Action {
  readonly type = ADDING_TO_PROJECT;
  constructor(public payload: AddToProjectRequest) {}
}

export class AddingToProjectSuccess implements Action {
  readonly type = ADDING_TO_PROJECT_SUCCESS;
  constructor() {}
}

export class AddingToProjectError implements Action {
  readonly type = ADDING_TO_PROJECT_ERROR;
  constructor() {}
}

export class ShowJobStatusModal implements Action {
  readonly type = SHOW_JOB_STATUS_MODAL;
  constructor(public payload: boolean) {}
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
  constructor() {}
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


export type JobsPageActions
  = SetJobsPageId
  | LoadCompany
  | LoadCompanySuccess
  | LoadCompanyError
  | HandleApiError
  | ShowAddToProjectModal
  | AddingToProject
  | AddingToProjectSuccess
  | AddingToProjectError
  | ShowJobStatusModal
  | ChangingJobStatus
  | ChangingJobStatusSuccess
  | ChangingJobStatusError
  | ConfirmDeletePricingFromGrid
  | DeletePricingFromGrid
  | DeletePricingSuccess
  | CancelDeletePricing
  | LoadCompanyPayMarkets
  | LoadCompanyPayMarketsSuccess;
