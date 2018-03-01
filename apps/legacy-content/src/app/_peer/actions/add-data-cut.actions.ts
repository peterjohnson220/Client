import { Action } from '@ngrx/store';

import { AddDataCutRequest } from 'libs/models/peer';

export const ADDING_DATA_CUT  = '[Legacy Content/Add Data Cut] Adding Data Cut';
export const ADDING_DATA_CUT_SUCCESS  = '[Legacy Content/Add Data Cut] Adding Data Cut Success';
export const ADDING_DATA_CUT_ERROR  = '[Legacy Content/Add Data Cut] Adding Data Cut Error';
export const CANCEL_ADD_DATA_CUT = '[Legacy Content/Add Data Cut] Cancel Add Data Cut';

export class AddingDataCut implements Action {
  readonly type = ADDING_DATA_CUT;

  constructor(public payload: AddDataCutRequest) { }
}

export class AddingDataCutSuccess implements Action {
  readonly type = ADDING_DATA_CUT_SUCCESS;
}

export class AddingDataCutError implements Action {
  readonly type = ADDING_DATA_CUT_ERROR;
}

export class CancelAddDataCut implements Action {
  readonly type = CANCEL_ADD_DATA_CUT;
}

export type Actions
  = AddingDataCut
  | AddingDataCutSuccess
  | AddingDataCutError
  | CancelAddDataCut;
