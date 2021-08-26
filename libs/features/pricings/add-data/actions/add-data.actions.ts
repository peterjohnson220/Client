import { Action } from '@ngrx/store';

import { ModifyPricingMatchesResponse } from 'libs/models/payfactors-api/pricings';

export const ADD_DATA = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project';
export const ADD_DATA_SUCCESS = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Success';
export const ADD_DATA_ERROR = '[Project Add Data/Add Survey Data Page] Add Data Cuts to Project Error';
export const RESET_ADD_DATA = '[Project Add Data/Add Survey Data Page] Reset Add Button';
export const SET_ADD_DATA_MODAL_STATUS = '[Project Add Data/Add Survey Data Page] Set Add Data Modal Status';
export const ADD_PRICING_MATCHES = '[Add Data / Modify Pricing] Add Pricing Matches';
export const ADD_PRICING_MATCHES_SUCCESS = '[Add Data / Modidfy Pricing] Add Pricing Matches Success';

export class AddData implements Action {
  readonly type = ADD_DATA;

  constructor(public payload: boolean) {}
}

export class AddDataSuccess implements Action {
  readonly type = ADD_DATA_SUCCESS;

  constructor(public payload: number[]) {}
}

export class AddDataError implements Action {
  readonly type = ADD_DATA_ERROR;

  constructor() {}
}

export class ResetAddData implements Action {
  readonly type = RESET_ADD_DATA;

  constructor() {}
}

export class SetAddDataModalStatus implements Action {
  readonly type = SET_ADD_DATA_MODAL_STATUS;

  constructor(public payload: boolean) {}
}

export class AddPricingMatches implements Action {
  readonly type = ADD_PRICING_MATCHES;
  constructor() {}
}

export class AddPricingMatchesSuccess implements Action {
  readonly type = ADD_PRICING_MATCHES_SUCCESS;
  constructor(public payload: ModifyPricingMatchesResponse[]) {}
}

export type Actions
  = AddData
  | AddDataSuccess
  | AddDataError
  | ResetAddData
  | SetAddDataModalStatus
  | AddPricingMatches;
