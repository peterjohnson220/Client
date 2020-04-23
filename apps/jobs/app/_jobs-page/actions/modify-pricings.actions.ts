import { Action } from '@ngrx/store';
import { MatchedSurveyJob } from 'libs/models/payfactors-api';

export const GET_PRICINGS_TO_MODIFY = '[Jobs Page] Get Pricings to Modify';
export const GET_PRICINGS_TO_MODIFY_SUCCESS = '[Jobs Page] Get Pricings to Modify Success';
export const MODIFY_PRICINGS_CANCEL = '[Jobs Page] Modify Pricings Cancel';

export class GetPricingsToModify implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY;
  constructor(public payload: number[]) {}
}

export class GetPricingsToModifySuccess implements Action {
  readonly type = GET_PRICINGS_TO_MODIFY_SUCCESS;
  constructor(public payload: MatchedSurveyJob[]) {}
}

export class ModifyPricingsCancel implements Action {
  readonly type = MODIFY_PRICINGS_CANCEL;
  constructor() {}
}

export type ModifyPricingsActions = GetPricingsToModify
  | GetPricingsToModifySuccess
  | ModifyPricingsCancel;
