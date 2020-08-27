import { Action } from '@ngrx/store';

export const RESET_EXCHANGE_EXPLORER_STATE = '[Features/Peer/ExchangeExplorer] Reset Exchange Explorer State';
export const RESET_INITIALLY_LOADED_EXCHANGE_EXPLORER_STATE = '[Features/Peer/ExchangeExplorer] Reset Initially Loaded Exchange Explorer State';

export class ResetExchangeExplorerState implements Action {
  readonly type = RESET_EXCHANGE_EXPLORER_STATE;
}

export class ResetInitiallyLoadedExchangeExplorerState implements Action {
  readonly type = RESET_INITIALLY_LOADED_EXCHANGE_EXPLORER_STATE;
}

export type Actions
  = ResetExchangeExplorerState
  | ResetInitiallyLoadedExchangeExplorerState;
