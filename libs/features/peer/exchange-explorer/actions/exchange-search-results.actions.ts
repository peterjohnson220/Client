import { Action } from '@ngrx/store';

export const GET_EXCHANGE_DATA_RESULTS = '[Features/Peer/Exchange Explorer] Get Exchange Data Results';
export const GET_EXCHANGE_DATA_RESULTS_SUCCESS = '[Features/Peer/Exchange Explorer] Get Exchange Data Results Success';
export const GET_EXCHANGE_DATA_RESULTS_ERROR = '[Features/Peer/Exchange Explorer] Get Exchange Data Results Error';

export class GetExchangeDataResults implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS;
}

export class GetExchangeDataResultsSuccess implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetExchangeDataResultsError implements Action {
  readonly type = GET_EXCHANGE_DATA_RESULTS_ERROR;

  constructor(public payload: number) {}
}

export type Actions
  = GetExchangeDataResults
  | GetExchangeDataResultsSuccess
  | GetExchangeDataResultsError;
