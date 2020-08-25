import { Action } from '@ngrx/store';

export const CLEAR_STATE = '[Pricing Match] Clear State';
export const LOAD_PRICING_MATCH = '[Pricing Match] Get Pricing Match';
export const LOAD_PRICING_MATCH_SUCCESS = '[Pricing Match] Load Pricing Match Success';
export const LOAD_PRICING_MATCH_ERROR = '[Pricing Match] Get Pricing Match Error';

export class ClearState implements Action {
  readonly type = CLEAR_STATE;
  constructor() { }
}

export class LoadPricingMatch implements Action {
  readonly type = LOAD_PRICING_MATCH;
  constructor(public payload: { pricingMatchId: number, matchType: string }) { }
}

export class LoadPricingMatchSuccess implements Action {
  readonly type = LOAD_PRICING_MATCH_SUCCESS;
  constructor(public payload: any) { }
}

export class GetPricingMatchError  implements Action {
  readonly type = LOAD_PRICING_MATCH_ERROR;
  constructor() { }
}


export type Actions
  = LoadPricingMatch
  | ClearState
  | GetPricingMatchError
  | LoadPricingMatchSuccess;
