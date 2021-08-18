import { Action } from '@ngrx/store';

import { GenericKeyValue } from 'libs/models/common';

export const OPEN_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map/Save Scope Modal] Open Save Exchange Scope Modal';
export const CLOSE_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map/Save Scope Modal] Close Save Exchange Scope Modal';
export const LOAD_PARENT_PAYMARKETS = '[Peer Main/Map/Save Scope Modal] Load Parent PayMarkets';
export const LOAD_PARENT_PAYMARKETS_SUCCESS = '[Peer Main/Map/Save Scope Modal] Load Parent PayMarkets Success';
export const LOAD_PARENT_PAYMARKETS_ERROR = '[Peer Main/Map/Save Scope Modal] Load Parent PayMarkets Error';

export class OpenSaveExchangeScopeModal implements Action {
  readonly type = OPEN_SAVE_EXCHANGE_SCOPE_MODAL;
}

export class CloseSaveExchangeScopeModal implements Action {
  readonly type = CLOSE_SAVE_EXCHANGE_SCOPE_MODAL;
}

export class LoadParentPayMarkets implements Action {
  readonly type = LOAD_PARENT_PAYMARKETS;
}

export class LoadParentPayMarketsSuccess implements Action {
  readonly type = LOAD_PARENT_PAYMARKETS_SUCCESS;

  constructor(public payload: GenericKeyValue<number, string>[]) { }
}

export class LoadParentPayMarketsError implements Action {
  readonly type = LOAD_PARENT_PAYMARKETS_ERROR;
}

export type Actions
  = OpenSaveExchangeScopeModal
  | CloseSaveExchangeScopeModal
  | LoadParentPayMarkets
  | LoadParentPayMarketsSuccess
  | LoadParentPayMarketsError;
