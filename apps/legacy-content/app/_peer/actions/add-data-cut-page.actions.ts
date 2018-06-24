import { Action } from '@ngrx/store';

import { ExchangeDataCutDetail } from 'libs/models/peer/exchange-data-cut-detail.model';

export const ADDING_DATA_CUT  = '[Legacy Content/Add Data Cut Page] Adding Data Cut';
export const ADDING_DATA_CUT_SUCCESS  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Success';
export const ADDING_DATA_CUT_ERROR  = '[Legacy Content/Add Data Cut Page] Adding Data Cut Error';
export const CANCEL_ADD_DATA_CUT = '[Legacy Content/Add Data Cut Page] Cancel Add Data Cut';
export const UPDATE_DATA_CUT = '[Legacy Content/Add Data Cut Page] Update Data Cut';
export const UPDATE_DATA_CUT_SUCCESS = '[Legacy Content/Add Data Cut Page] Update Data Cut Success';
export const UPDATE_DATA_CUT_ERROR = '[Legacy Content/Add Data Cut Page] Update Data Cut Error';
export const CANCEL_UPDATE_DATA_CUT = '[Legacy Content/Add Data Cut Page] Cancel Update Data Cut';
export const PAGE_IN_VIEW_IN_IFRAME = '[Legacy Content/Add Data Cut Page] Page In View From IFrame';
export const LOAD_DATA_CUT_DETAILS = '[Legacy Content/Add Data Cut Page] Load Data Cut Details';
export const LOAD_DATA_CUT_DETAILS_SUCCESS = '[Legacy Content/Add Data Cut Page] Load Data Cut Details Success';
export const LOAD_DATA_CUT_DETAILS_ERROR = '[Legacy Content/Add Data Cut Page] Load Data Cut Details Error';


export class AddingDataCut implements Action {
  readonly type = ADDING_DATA_CUT;

  constructor(public payload: any) { }
}

export class AddingDataCutSuccess implements Action {
  readonly type = ADDING_DATA_CUT_SUCCESS;

  constructor(public payload: number) {}
}

export class AddingDataCutError implements Action {
  readonly type = ADDING_DATA_CUT_ERROR;
}

export class CancelAddDataCut implements Action {
  readonly type = CANCEL_ADD_DATA_CUT;
}

export class UpdateDataCut implements Action {
  readonly type = UPDATE_DATA_CUT;

  constructor(public payload: any) {}
}

export class UpdateDataCutSuccess implements Action {
  readonly type = UPDATE_DATA_CUT_SUCCESS;

  constructor(public payload: number) {}
}

export class UpdateDataCutError implements Action {
  readonly type = UPDATE_DATA_CUT_ERROR;
}

export class CancelUpdateDataCut implements Action {
  readonly type = CANCEL_UPDATE_DATA_CUT;
}

export class PageInViewInIframe implements Action {
  readonly type = PAGE_IN_VIEW_IN_IFRAME;
}

export class LoadDataCutDetails implements Action {
  readonly type = LOAD_DATA_CUT_DETAILS;

  constructor(public payload: string) {}
}

export class LoadDataCutDetailsSuccess implements Action {
  readonly type = LOAD_DATA_CUT_DETAILS_SUCCESS;

  constructor(public payload: ExchangeDataCutDetail) {}
}

export class LoadDataCutDetailsError implements Action {
  readonly type = LOAD_DATA_CUT_DETAILS_ERROR;
}

export type Actions
  = AddingDataCut
  | AddingDataCutSuccess
  | AddingDataCutError
  | CancelAddDataCut
  | UpdateDataCut
  | UpdateDataCutSuccess
  | UpdateDataCutError
  | CancelUpdateDataCut
  | PageInViewInIframe
  | LoadDataCutDetails
  | LoadDataCutDetailsSuccess
  | LoadDataCutDetailsError;
