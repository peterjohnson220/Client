import { Action } from '@ngrx/store';

export const OPEN_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map] Open Save Exchange Scope Modal';
export const CLOSE_SAVE_EXCHANGE_SCOPE_MODAL = '[Peer Main/Map] Close Save Exchange Scope Modal';

export class OpenSaveExchangeScopeModal implements Action {
  readonly type = OPEN_SAVE_EXCHANGE_SCOPE_MODAL;
}

export class CloseSaveExchangeScopeModal implements Action {
  readonly type = CLOSE_SAVE_EXCHANGE_SCOPE_MODAL;
}

export type Actions
  = OpenSaveExchangeScopeModal
  | CloseSaveExchangeScopeModal;
