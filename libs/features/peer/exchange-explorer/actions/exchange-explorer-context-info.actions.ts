import { Action } from '@ngrx/store';

import { SearchFilterMappingDataObj } from '../../../search/models';
import { PayMarket } from '../../../../models/paymarket';
import { ExchangeJobExchangeDetail } from '../../models';

export const LOAD_CONTEXT_INFO = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info';
export const LOAD_CONTEXT_INFO_SUCCESS = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info Success';
export const LOAD_CONTEXT_INFO_ERROR = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info Error';

export class LoadContextInfo implements Action {
  readonly type = LOAD_CONTEXT_INFO;

  constructor(public payload: {companyJobId?: number, companyPayMarketId?: number}|{exchangeId: number}) {}
}

export class LoadContextInfoSuccess implements Action {
  readonly type = LOAD_CONTEXT_INFO_SUCCESS;

  constructor(public payload: {
    payMarket: PayMarket,
    exchangeJobFilterOptions: ExchangeJobExchangeDetail[],
    searchFilterMappingDataObj: SearchFilterMappingDataObj
  }) {}
}

export class LoadContextInfoError implements Action {
  readonly type = LOAD_CONTEXT_INFO_ERROR;
}
export type Actions
  = LoadContextInfo
  | LoadContextInfoSuccess
  | LoadContextInfoError;
