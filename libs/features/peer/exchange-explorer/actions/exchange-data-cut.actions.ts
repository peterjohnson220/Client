import { Action } from '@ngrx/store';

import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export const LOAD_EXCHANGE_DATA_CUT = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut';
export const LOAD_EXCHANGE_DATA_CUT_SUCCESS = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut Success';
export const LOAD_EXCHANGE_DATA_CUT_ERROR = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut Error';

export class LoadExchangeDataCut implements Action {
  readonly type = LOAD_EXCHANGE_DATA_CUT;

  constructor(public payload: {companyJobId: number, exchangeDataCutGuid: string}) {}
}

export class LoadExchangeDataCutSuccess implements Action {
  readonly type = LOAD_EXCHANGE_DATA_CUT_SUCCESS;

  constructor(public payload: ExchangeExplorerScopeResponse) {}
}

export class LoadExchangeDataCutError implements Action {
  readonly type = LOAD_EXCHANGE_DATA_CUT_ERROR;
}
export type Actions
  = LoadExchangeDataCut
  | LoadExchangeDataCutSuccess
  | LoadExchangeDataCutError;
