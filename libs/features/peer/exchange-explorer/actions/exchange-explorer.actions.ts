import { Action } from '@ngrx/store';

export const RESET_EXCHANGE_EXPLORER_STATE = '[Features/Peer/ExchangeExplorer] Reset Exchange Explorer State';

export class ResetExchangeExplorerState implements Action {
  readonly type = RESET_EXCHANGE_EXPLORER_STATE;
}

export type Actions
  = ResetExchangeExplorerState;
