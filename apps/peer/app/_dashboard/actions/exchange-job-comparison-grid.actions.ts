import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_JOB_COMPARISONS  = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons';
export const LOAD_EXCHANGE_JOB_COMPARISONS_SUCCESS  = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons Success';
export const LOAD_EXCHANGE_JOB_COMPARISONS_ERROR = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons Error';
export const LOAD_EXCHANGE_JOB_ORGS = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Orgs';
export const LOAD_EXCHANGE_JOB_ORGS_SUCCESS = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Orgs Success';
export const SELECT_COMPARISON_MARKET = '[Peer Main/Exchange Job Comparisons] Select Comparison Market';
export const SELECTED_COMPARISON_MARKET_PERSISTED = '[Peer Main/Exchange Job Comparisons] Selected Comparison Market Persisted';
export const SELECT_RATE = '[Peer Main/Exchange Job Comparisons] Select Rate';
export const SELECTED_RATE_PERSISTED = '[Peer Main/Exchange Job Comparisons] Selected Rate Persisted';
export const SELECT_WEIGHT = '[Peer Main/Exchange Job Comparisons] Select Weight';
export const SELECTED_WEIGHT_PERSISTED = '[Peer Main/Exchange Job Comparisons] Select Weight Persisted';

export class LoadExchangeJobComparisons implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS;

  constructor(public payload?: {countryCode: string}) {}
}

export class LoadExchangeJobComparisonsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobComparisonsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS_ERROR;
}

export class SelectComparisonMarket implements Action {
  readonly type = SELECT_COMPARISON_MARKET;

  constructor(public payload: {newMarket: string}) {}
}

export class SelectedComparisonMarketPersisted implements Action {
  readonly type = SELECTED_COMPARISON_MARKET_PERSISTED;
}

export class SelectRate implements Action {
  readonly type = SELECT_RATE;

  constructor(public payload: {newRate: string}) {}
}

export class SelectedRatePersisted implements Action {
  readonly type = SELECTED_RATE_PERSISTED;
}

export class SelectWeight implements Action {
  readonly type = SELECT_WEIGHT;

  constructor(public payload: {newWeight: string}) {}
}

export class SelectedWeightPersisted implements Action {
  readonly type = SELECTED_WEIGHT_PERSISTED;
}

export type Actions
  = LoadExchangeJobComparisons
  | LoadExchangeJobComparisonsSuccess
  | LoadExchangeJobComparisonsError
  | SelectComparisonMarket
  | SelectedComparisonMarketPersisted
  | SelectRate
  | SelectedRatePersisted
  | SelectWeight
  | SelectedWeightPersisted;
