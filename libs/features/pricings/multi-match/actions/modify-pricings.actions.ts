import { Action } from '@ngrx/store';
import { GetPricingsToModifyRequest } from '../models';

export const GET_PRICINGS_TO_MODIFY = '[Multi Match] Get Pricings to Modify';
export const GET_PRICINGS_TO_MODIFY_SUCCESS = '[Multi Match] Get Pricings to Modify Success';
export const GET_PRICINGS_TO_MODIFY_ERROR = '[Multi Match] Get Pricings to Modify Error';
export const MODIFY_PRICINGS = '[Multi Match] Modify Pricings';
export const MODIFY_PRICINGS_SUCCESS = '[Multi Match] Modify Pricings Success';
export const MODIFY_PRICINGS_ERROR = '[Multi Match] Modify Pricings Error';

export class ModifyPricingsError implements Action {
readonly type = MODIFY_PRICINGS_ERROR;
  constructor() { }
}

export class GetPricingsToModify implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY;
  constructor(public payload: GetPricingsToModifyRequest) { }
}

export class ModifyPricings implements Action {
  readonly type = MODIFY_PRICINGS;
  constructor() { }
}

export class GetPricingsToModifySuccess implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY_SUCCESS;
  constructor() { }
}

export class ModifyPricingSuccess implements Action {
  readonly type = MODIFY_PRICINGS_SUCCESS;
  constructor(public payload: any[]) { }
}

export class GetPricingsToModifyError implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY_ERROR;
  constructor() { }
}



export type ModifyPricingsActions
  = GetPricingsToModify
  | GetPricingsToModifySuccess
  | GetPricingsToModifyError
  | ModifyPricings
  | ModifyPricingSuccess
  | ModifyPricingsError;
