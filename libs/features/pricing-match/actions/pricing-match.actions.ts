import { Action } from '@ngrx/store';

export const CLEAR_STATE = '[Pricing Match] Clear State';
export const LOAD_PRICING_MATCH = '[Pricing Match] Get Pricing Match';
export const LOAD_PEER_MATCH = '[Pricing Match] Load Peer Match';
export const LOAD_PRICING_MATCH_SUCCESS = '[Pricing Match] Load Pricing Match Success';
export const LOAD_SURVEY_MATCH = '[Pricing Match] Load Survey Match';
export const LOAD_SLOTTED_COMPANY_JOB_MATCH = '[Pricing Match] Load Slotted Company Job Match';
export const LOAD_MDJOB_MATCH = '[Pricing Match] Load MDJob Match';
export const LOAD_PRICING_MATCH_ERROR = '[Pricing Match] Get Peer Match Error';

export class LoadPeerMatch implements Action {
  readonly type = LOAD_PEER_MATCH;
  constructor(public filterGUID: string) { }
}

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

export class LoadSurveyMatch implements Action {
  readonly type = LOAD_SURVEY_MATCH;
  constructor(public surveyDataId: number) { }
}

export class LoadMdJobMatch implements Action {
  readonly type = LOAD_MDJOB_MATCH;
  constructor(public mdJobCode: string, public pricingId: number) { }
}


export class LoadSlottedCompanyJobMatch implements Action {
  readonly type = LOAD_SLOTTED_COMPANY_JOB_MATCH;
  constructor(public companyJobId: number) { }
}


export type Actions
  = LoadPeerMatch
  | ClearState
  | GetPricingMatchError
  | LoadSurveyMatch
  | LoadMdJobMatch
  | LoadPricingMatchSuccess
  | LoadSlottedCompanyJobMatch;
