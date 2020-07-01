import { Action } from '@ngrx/store';
import { MatchedSurveyJob } from 'libs/models/payfactors-api/index';

export const GET_PRICINGS_TO_MODIFY = '[Jobs Page] Get Pricings to Modify';
export const GET_PRICINGS_TO_MODIFY_SUCCESS = '[Jobs Page] Get Pricings to Modify Success';
export const GET_PRICINGS_TO_MODIFY_ERROR = '[Jobs Page] Get Pricings to Modify Error';

export class GetPricingsToModify implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY;
  constructor(public payload: number[]) { }
}

export class GetPricingsToModifySuccess implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY_SUCCESS;
  constructor() { }
}

export class GetPricingsToModifyError implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY_ERROR;
  constructor() { }
}



export type ModifyPricingsActions
  = GetPricingsToModify
  | GetPricingsToModifySuccess
  | GetPricingsToModifyError;
