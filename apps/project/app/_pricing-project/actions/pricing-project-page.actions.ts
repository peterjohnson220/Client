import { Action } from '@ngrx/store';

export const GET_PRICING_PROJECT = '[Pricing Project Page] Get Pricing Project';
export const GET_PRICING_PROJECT_SUCCESS = '[Pricing Project Page] Get Pricing Project Success';


export class GetPricingProject implements Action {
  readonly type = GET_PRICING_PROJECT;
  constructor(public payload: number) {}
}

export class GetPricingProjectSuccess implements Action {
  readonly type = GET_PRICING_PROJECT_SUCCESS;
  constructor(public payload: any) {}
}

export type PricingProjectPageActions
  = GetPricingProject
  | GetPricingProjectSuccess;
