import { Action } from '@ngrx/store';

import { MapGeoData } from 'libs/models/peer';
import { PayMarket } from 'libs/models/paymarket';
import { ComphubExchangeExplorerContextRequest } from 'libs/models/peer/requests/comphub-exchange-explorer-context-request.model';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';

import { SearchFilterMappingDataObj } from '../../../search/search/models';
import { ExchangeJobExchangeDetail } from '../../models';

export const LOAD_CONTEXT_INFO = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info';
export const LOAD_CONTEXT_INFO_SUCCESS = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info Success';
export const LOAD_CONTEXT_INFO_ERROR = '[Features/Peer/ExchangeExplorer/ContextInfo] Load Context Info Error';
export const REFRESH_PAYMARKET_CONTEXT = '[Features/Peer/ExchangeExplorer/ContextInfo] Refresh PayMarket Context';
export const REFRESH_PAYMARKET_CONTEXT_SUCCESS = '[Features/Peer/ExchangeExplorer/ContextInfo] Refresh PayMarket Context Success';
export const REFRESH_PAYMARKET_CONTEXT_ERROR = '[Features/Peer/ExchangeExplorer/ContextInfo] Refresh PayMarket Context Error';
export const RESET_INITIALLY_LOADED_STATE = '[Features/Peer/ExchangeExplorer/ContextInfo] Reset Initially Loaded State';

export class LoadContextInfo implements Action {
  readonly type = LOAD_CONTEXT_INFO;

  constructor(public payload:
    {request: ComphubExchangeExplorerContextRequest, includeCurrentCompany?: boolean}
    | {companyJobId?: number, companyPayMarketId?: number}
    | {exchangeId: number, defaultScopeId?: string, includeDisabledFilters?: boolean, includeCurrentCompany?: boolean}
    | {lockedExchangeJobId: number, companyPayMarketId: number}
    | {lockedExchangeJobId: number, exchangeDataSearchRequest: BaseExchangeDataSearchRequest}
    ) {}
}

export class LoadContextInfoSuccess implements Action {
  readonly type = LOAD_CONTEXT_INFO_SUCCESS;

  constructor(public payload: {
    payMarket: PayMarket,
    payMarketGeoData: MapGeoData,
    exchangeJobFilterOptions: ExchangeJobExchangeDetail[],
    searchFilterMappingDataObj: SearchFilterMappingDataObj,
    includeDisabledFilters?: boolean,
    includeCurrentCompany?: boolean
  }) {}
}

export class LoadContextInfoError implements Action {
  readonly type = LOAD_CONTEXT_INFO_ERROR;
}

export class RefreshPayMarketContext implements Action {
  readonly type = REFRESH_PAYMARKET_CONTEXT;

  constructor(public payload: {companyJobId?: number, companyPayMarketId?: number, exchangeJobId?: number}|
                              {companyJobId?: number, exchangeJobId?: number, cutGuid?: string}) {}
}

export class RefreshPayMarketContextSuccess implements Action {
  readonly type = REFRESH_PAYMARKET_CONTEXT_SUCCESS;

  constructor(public payload: {
    payMarket: PayMarket,
    payMarketGeoData: MapGeoData
  }) {}
}

export class RefreshPayMarketContextError implements Action {
  readonly type = REFRESH_PAYMARKET_CONTEXT_ERROR;
}

export class ResetInitiallyLoadedState implements Action {
  readonly type = RESET_INITIALLY_LOADED_STATE;
}

export type Actions
  = LoadContextInfo
  | LoadContextInfoSuccess
  | LoadContextInfoError
  | RefreshPayMarketContext
  | RefreshPayMarketContextSuccess
  | RefreshPayMarketContextError
  | ResetInitiallyLoadedState;
