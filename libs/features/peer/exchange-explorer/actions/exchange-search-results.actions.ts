import { Action } from '@ngrx/store';

import { ExchangeDataSearchResponse } from 'libs/models/payfactors-api/peer/exchange-data-search/response';

export const GET_EXCHANGE_DATA_RESULTS = '[Features/Peer/Exchange Explorer] Get Exchange Data Results';
export const GET_EXCHANGE_DATA_RESULTS_SUCCESS = '[Features/Peer/Exchange Explorer] Get Exchange Data Results Success';
export const GET_EXCHANGE_DATA_RESULTS_ERROR = '[Features/Peer/Exchange Explorer] Get Exchange Data Results Error';

export class GetExchangeDataResults implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS;

  constructor(public payload?: {
    getSingledFilteredAggregates?: boolean,
    resetInitialBounds?: boolean,
    resetToPayMarketBounds?: boolean,
    getChildFilteredAggregates?: boolean

  }) {}
}

export class GetExchangeDataResultsSuccess implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_SUCCESS;

  constructor(public payload: {
    response: ExchangeDataSearchResponse,
    getSingledFilteredAggregates?: boolean,
    resetInitialBounds?: boolean,
    resetToPayMarketBounds?: boolean,
    getChildFilteredAggregates?: boolean
  }) {}
}

export class GetExchangeDataResultsError implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_ERROR;

  constructor(public payload: number) {}
}

export type Actions
  = GetExchangeDataResults
  | GetExchangeDataResultsSuccess
  | GetExchangeDataResultsError;
