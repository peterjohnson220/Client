import { Action } from '@ngrx/store';

import { PeerMapScopeSystemDetails } from 'libs/models/peer/exchange-scope/peer-map-scope-system-details.model';

export const UPSERT_DATA_CUT  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut';
export const UPSERT_DATA_CUT_NEW  = '[Legacy Content/Upsert Data Cut Page New] Upsert Data Cut New';
export const UPSERT_DATA_CUT_SUCCESS  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut Success';
export const UPSERT_DATA_CUT_ERROR  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut Error';
export const CANCEL_UPSERT_DATA_CUT = '[Legacy Content/Upsert Data Cut Page] Cancel Upsert Data Cut';
export const PAGE_IN_VIEW_IN_IFRAME = '[Legacy Content/Upsert Data Cut Page] Page In View From IFrame';
export const LOAD_DATA_CUT_DETAILS = '[Legacy Content/Upsert Data Cut Page] Load Data Cut Details';
export const LOAD_DATA_CUT_DETAILS_SUCCESS = '[Legacy Content/Upsert Data Cut Page] Load Data Cut Details Success';
export const LOAD_DATA_CUT_DETAILS_ERROR = '[Legacy Content/Upsert Data Cut Page] Load Data Cut Details Error';

export class UpsertDataCut implements Action {
  readonly type = UPSERT_DATA_CUT;

  constructor(public payload: any) {}
}

export class UpsertDataCutNew implements Action {
  readonly type = UPSERT_DATA_CUT_NEW;

  constructor(public payload: any) {}
}

export class UpsertDataCutSuccess implements Action {
  readonly type = UPSERT_DATA_CUT_SUCCESS;

  constructor(public payload: number) {}
}

export class UpsertDataCutError implements Action {
  readonly type = UPSERT_DATA_CUT_ERROR;
}

export class CancelUpsertDataCut implements Action {
  readonly type = CANCEL_UPSERT_DATA_CUT;
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

  constructor(public payload: PeerMapScopeSystemDetails) {}
}

export class LoadDataCutDetailsError implements Action {
  readonly type = LOAD_DATA_CUT_DETAILS_ERROR;
}

export type Actions
  = UpsertDataCut
  | UpsertDataCutNew
  | UpsertDataCutSuccess
  | UpsertDataCutError
  | CancelUpsertDataCut
  | PageInViewInIframe
  | LoadDataCutDetails
  | LoadDataCutDetailsSuccess
  | LoadDataCutDetailsError;
