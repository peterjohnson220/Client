import { Action } from '@ngrx/store';
import { GetPricingsToModifyRequest } from '../models';

export const GET_PRICINGS_TO_MODIFY = '[Jobs Page] Get Pricings to Modify';
export const GET_PRICINGS_TO_MODIFY_SUCCESS = '[Jobs Page] Get Pricings to Modify Success';
export const GET_PRICINGS_TO_MODIFY_ERROR = '[Jobs Page] Get Pricings to Modify Error';
export const MODIFY_PRICINGS = '[Jobs Page] Modify Pricings';
export const MODIFY_PRICINGS_SUCCESS = '[Jobs Page] Modify Pricings Success';
export const MODIFY_PRICINGS_ERROR = '[Jobs Page] Modify Pricings Error';

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
  constructor() { }
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
