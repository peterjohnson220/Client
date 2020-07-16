import { Action } from '@ngrx/store';

export const UPSERT_DATA_CUT  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut';
export const UPSERT_DATA_CUT_SUCCESS  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut Success';
export const UPSERT_DATA_CUT_ERROR  = '[Legacy Content/Upsert Data Cut Page] Upsert Data Cut Error';
export const CANCEL_UPSERT_DATA_CUT = '[Legacy Content/Upsert Data Cut Page] Cancel Upsert Data Cut';
export const PAGE_IN_VIEW_IN_IFRAME = '[Legacy Content/Upsert Data Cut Page] Page In View From IFrame';
export const SELECT_WEIGHTING_TYPE = '[Legacy Content/Upsert Data Cut Page] Select Weighting Type';
export const SELECTED_WEIGHTING_TYPE_PERSISTED = '[Legacy Content/Upsert Data Cut Page] Selected Weighting Type Persisted';

export class UpsertDataCut implements Action {
  readonly type = UPSERT_DATA_CUT;

  constructor(public payload: any) {}
}

export class UpsertDataCutSuccess implements Action {
  readonly type = UPSERT_DATA_CUT_SUCCESS;

  constructor(public payload: {UserJobMatchId: number, IsUpdate: boolean}) {}
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

export type Actions
  = UpsertDataCut
  | UpsertDataCutSuccess
  | UpsertDataCutError
  | CancelUpsertDataCut
  | PageInViewInIframe
  | SelectWeightingType
  | SelectedWeightingTypePersisted;
