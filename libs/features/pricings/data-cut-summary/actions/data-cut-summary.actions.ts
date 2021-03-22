import { Action } from '@ngrx/store';
import { DataCutSummaryEntityTypes } from 'libs/constants';

export const CLEAR_DATA_CUT_SUMMARY = '[Job Summary] Clear Data Cut Summary';
export const LOAD_DATA_CUT_SUMMARY = '[Job Summary] Load Data Cut Summary';
export const LOAD_DATA_CUT_SUMMARY_SUCCESS = '[Job Summary] Load Data Cut Summary Success';
export const LOAD_DATA_CUT_SUMMARY_ERROR = '[Job Summary] Load Data Cut Summary Error';
export const ADD_DATA_CUT_SUMMARY = '[Job Summary] Add Data Cut Summary';
export const REMOVE_DATA_CUT_SUMMARY = '[Job Summary] Remove Data Cut Summary';

export class ClearDataCutSummary implements Action {
  readonly type = CLEAR_DATA_CUT_SUMMARY;
  constructor() { }
}

export class LoadDataCutSummary implements Action {
  readonly type = LOAD_DATA_CUT_SUMMARY;
  constructor(public payload: { entityId: any, entityType: DataCutSummaryEntityTypes, matchType: string }) { }
}

export class LoadDataCutSummarySuccess implements Action {
  readonly type = LOAD_DATA_CUT_SUMMARY_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadDataCutSummaryError  implements Action {
  readonly type = LOAD_DATA_CUT_SUMMARY_ERROR;
  constructor() { }
}

export class AddDataCutSummary implements Action {
  readonly type = ADD_DATA_CUT_SUMMARY;
  constructor(public payload: { dataCutKey: string, response: any }) { }
}

export class RemoveDataCutSummary implements Action {
  readonly type = REMOVE_DATA_CUT_SUMMARY;
  constructor(public payload : {dataCutKey: string }) { }
}

export type Actions
  = ClearDataCutSummary
  | LoadDataCutSummary
  | LoadDataCutSummarySuccess
  | LoadDataCutSummaryError
  | AddDataCutSummary
  | RemoveDataCutSummary;
