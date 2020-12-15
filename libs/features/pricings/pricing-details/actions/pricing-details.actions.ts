import { Action } from '@ngrx/store';

import { PricingInfo, CreateProjectRequest } from 'libs/models/payfactors-api';

export const RESET_STATE = '[Pricing Details] Reset State';
export const GET_PRICING_INFO = '[Pricing Details] Get Pricing Info';
export const GET_PRICING_INFO_SUCCESS = '[Pricing Details] Get Pricing Info Success';
export const GET_PRICING_INFO_ERROR = '[Pricing Details] Get Pricing Info Error';
export const ADDING_TO_NEW_PROJECT = '[Pricing Details] Creating Project';
export const ADDING_TO_NEW_PROJECT_SUCCESS = '[Pricing Details] Creating Project Success';
export const ADDING_TO_NEW_PROJECT_ERROR = '[Pricing Details] Creating Project Error';
export const SAVING_PRICING = '[Pricing Details] Saving Pricing';
export const SAVING_PRICING_SUCCESS = '[Pricing Details] Saving Pricing Success';
export const SAVING_PRICING_ERROR = '[Pricing Details] Saving Pricing Error';
export const STATUS_CHANGED = '[Pricing Details] Status Changed';

export class ResetState implements Action {
  readonly type = RESET_STATE;
  constructor() { }
}

export class GetPricingInfo implements Action {
  readonly type = GET_PRICING_INFO;
  constructor(public payload: number) { }
}

export class GetPricingInfoSuccess implements Action {
  readonly type = GET_PRICING_INFO_SUCCESS;
  constructor(public payload: PricingInfo) { }
}

export class GetPricingInfoError implements Action {
  readonly type = GET_PRICING_INFO_ERROR;
  constructor() { }
}

export class AddingToNewProject implements Action {
  readonly type = ADDING_TO_NEW_PROJECT;
  constructor(public payload: CreateProjectRequest) {}
}

export class AddingToNewProjectSuccess implements Action {
  readonly type = ADDING_TO_NEW_PROJECT_SUCCESS;
  constructor() {}
}

export class AddingToNewProjectError implements Action {
  readonly type = ADDING_TO_NEW_PROJECT_ERROR;
  constructor(public error: any) {}
}

export class SavingPricing implements Action {
  readonly type = SAVING_PRICING;
  constructor(public pricingId: number) {}
}

export class SavingPricingSuccess implements Action {
  readonly type = SAVING_PRICING_SUCCESS;
  constructor() {}
}

export class SavingPricingError implements Action {
  readonly type = SAVING_PRICING_ERROR;
  constructor(public error: any) {}
}

export class StatusChanged implements Action {
  readonly type = STATUS_CHANGED;
  constructor(public newStatus: string) {}
}

export type Actions
 = ResetState
 | GetPricingInfo
 | GetPricingInfoSuccess
 | GetPricingInfoError
 | AddingToNewProject
 | AddingToNewProjectSuccess
 | AddingToNewProjectError
 | SavingPricing
 | SavingPricingSuccess
 | SavingPricingError
 | StatusChanged;
