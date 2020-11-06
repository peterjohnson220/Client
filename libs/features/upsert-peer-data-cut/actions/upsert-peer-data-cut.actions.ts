import { Action } from '@ngrx/store';

export const UPSERT_DATA_CUT  = '[Upsert Peer Data Cut] Upsert Data Cut';
export const UPSERT_DATA_CUT_SUCCESS  = '[Upsert Peer Data Cut] Upsert Data Cut Success';
export const UPSERT_DATA_CUT_ERROR  = '[Upsert Peer Data Cut] Upsert Data Cut Error';
export const CANCEL_UPSERT_DATA_CUT = '[Upsert Peer Data Cut] Cancel Upsert Data Cut';
export const PAGE_IN_VIEW_IN_IFRAME = '[Upsert Peer Data Cut] Page In View From IFrame';
export const SELECT_WEIGHTING_TYPE = '[Upsert Peer Data Cut] Select Weighting Type';
export const SELECTED_WEIGHTING_TYPE_PERSISTED = '[Upsert Peer Data Cut] Selected Weighting Type Persisted';

export class UpsertDataCut implements Action {
  readonly type = UPSERT_DATA_CUT;

  constructor(public payload: any) {}
}

export class UpsertDataCutSuccess implements Action {
  readonly type = UPSERT_DATA_CUT_SUCCESS;

  constructor(public payload: {UserJobMatchId: number, IsUpdate: boolean, BaseEntityId?: number}) {}
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

export class SelectWeightingType implements Action {
  readonly type = SELECT_WEIGHTING_TYPE;

  constructor(public payload: {newWeightingType: string}) {}
}

export class SelectedWeightingTypePersisted implements Action {
  readonly type = SELECTED_WEIGHTING_TYPE_PERSISTED;
}

export type UpsertPeerDataCutActions
  = UpsertDataCut
  | UpsertDataCutSuccess
  | UpsertDataCutError
  | CancelUpsertDataCut
  | PageInViewInIframe
  | SelectWeightingType
  | SelectedWeightingTypePersisted;
