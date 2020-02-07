import { Action } from '@ngrx/store';

import { DeletePricingRequest } from 'libs/models/payfactors-api/pricings/request';
import { AddToProjectRequest } from '../models';

export const SET_JOBS_PAGE_ID = '[Jobs Page] Set Jobs PageID';
export const LOAD_COMPANY = '[Jobs Page] Load Company';
export const LOAD_COMPANY_ERROR = '[Jobs Page] Load Company Error';
export const LOAD_COMPANY_SUCCESS = '[Jobs Page] Load Company Success';
export const HANDLE_API_ERROR = '[Jobs Page] Handle API Error';
export const ADD_TO_PROJECT = '[Jobs Page] Add To Project';
export const ADD_TO_PROJECT_SUCCESS = '[Jobs Page] Add To Project Success';
export const ADD_TO_PROJECT_SUMMARY = '[Jobs Page] Add to Project Summary';
export const CANCEL_ADD_TO_PROJECT_SUMMARY = '[Jobs Page] Cancel Add to Project Summary';
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

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export class AddToProject implements Action {
  readonly type = ADD_TO_PROJECT;
  constructor(public payload: AddToProjectRequest) {}
}

export class AddToProjectSuccess implements Action {
  readonly type = ADD_TO_PROJECT_SUCCESS;
  constructor() {}
}

export class AddToProjectSummary implements Action {
  readonly type = ADD_TO_PROJECT_SUMMARY;
  constructor(public payload: AddToProjectRequest) {}
}

export class CancelAddToProjectSummary implements Action {
  readonly type = CANCEL_ADD_TO_PROJECT_SUMMARY;
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
  | HandleApiError
  | AddToProject
  | AddToProjectSuccess
  | AddToProjectSummary
  | CancelAddToProjectSummary
  | ConfirmDeletePricingFromGrid
  | DeletePricingFromGrid
  | DeletePricingSuccess
  | CancelDeletePricing
  | LoadCompanyPayMarkets
  | LoadCompanyPayMarketsSuccess;
