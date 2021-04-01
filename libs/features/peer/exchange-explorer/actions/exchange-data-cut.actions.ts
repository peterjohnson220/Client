import { Action } from '@ngrx/store';

import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';
import { TempDataCutIdentity } from 'libs/features/pricings/multi-match/models';

export const LOAD_EXCHANGE_DATA_CUT = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut';
export const LOAD_TEMP_EXCHANGE_DATA_CUT = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Temp Exchange Data Cut';
export const LOAD_EXCHANGE_DATA_CUT_SUCCESS = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut Success';
export const LOAD_EXCHANGE_DATA_CUT_ERROR = '[Features/Peer/ExchangeExplorer/Exchange Data Cut] Load Exchange Data Cut Error';

export class LoadExchangeDataCut implements Action {
  readonly type = LOAD_EXCHANGE_DATA_CUT;

  constructor(public payload: {companyJobId: number, exchangeDataCutGuid: string}) {}
}

export class LoadTempExchangeDataCut implements Action {
  readonly type = LOAD_TEMP_EXCHANGE_DATA_CUT;

  constructor(public payload: {lockedExchangeJobId: number, exchangeDataSearchRequest: BaseExchangeDataSearchRequest}|TempDataCutIdentity) { }
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
  | LoadTempExchangeDataCut
  | LoadExchangeDataCutSuccess
  | LoadExchangeDataCutError;
