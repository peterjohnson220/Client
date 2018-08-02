import { Action } from '@ngrx/store';

export const UPSERT_EXCHANGE_SCOPE  = '[Peer Main/Map] Upsert Exchange Scope';
export const UPSERT_EXCHANGE_SCOPE_SUCCESS  = '[Peer Main/Map] Upsert Exchange Scope Success';
export const UPSERT_EXCHANGE_SCOPE_ERROR  = '[Peer Main/Map] Upsert Exchange Scope Error';
export const OPEN_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map] Open Save Exchange Scope Modal';
export const CLOSE_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map] Close Save Exchange Scope Modal';

export class UpsertExchangeScope implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE;

  constructor(public payload: any) {}
}

export class UpsertExchangeScopeSuccess implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE_SUCCESS;
}

export class UpsertExchangeScopeError implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE_ERROR;
}

export class OpenSaveExchangeScopeModal implements Action {
  readonly type = OPEN_SAVE_EXCHANGE_SCOPE_MODAL;
}

export class CloseSaveExchangeScopeModal implements Action {
  readonly type = CLOSE_SAVE_EXCHANGE_SCOPE_MODAL;
}

export type Actions
  = UpsertExchangeScope
  | UpsertExchangeScopeSuccess
  | UpsertExchangeScopeError
  | OpenSaveExchangeScopeModal
  | CloseSaveExchangeScopeModal;
