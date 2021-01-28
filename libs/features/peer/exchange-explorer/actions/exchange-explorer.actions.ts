import { Action } from '@ngrx/store';

import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';

export const REFINE_EXCHANGE_JOB = '[Features/Peer/ExchangeExplorer] Refine Exchange Job';
export const EDIT_TEMP_DATA_CUT = '[Features/Peer/ExchangeExplorer] Edit Temp Data Cut';
export const RESET_EXCHANGE_EXPLORER_STATE = '[Features/Peer/ExchangeExplorer] Reset Exchange Explorer State';
export const RESET_INITIALLY_LOADED_EXCHANGE_EXPLORER_STATE = '[Features/Peer/ExchangeExplorer] Reset Initially Loaded Exchange Explorer State';

export class ResetExchangeExplorerState implements Action {
  readonly type = RESET_EXCHANGE_EXPLORER_STATE;
}

export class ResetInitiallyLoadedExchangeExplorerState implements Action {
  readonly type = RESET_INITIALLY_LOADED_EXCHANGE_EXPLORER_STATE;
}

export class RefineExchangeJob implements Action {
  readonly type = REFINE_EXCHANGE_JOB;

  constructor(public payload: {lockedExchangeJobId: number, companyPayMarketId?: number}) {
  }
}

export class EditTempDataCut implements Action {
  readonly type = EDIT_TEMP_DATA_CUT;

  constructor(public payload: {lockedExchangeJobId: number, exchangeDataSearchRequest: BaseExchangeDataSearchRequest}) {}
}

export type Actions
  = RefineExchangeJob
  | ResetExchangeExplorerState
  | ResetInitiallyLoadedExchangeExplorerState
  | EditTempDataCut;
