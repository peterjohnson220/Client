import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_EXCHANGE_JOB_COMPARISONS  = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons';
export const LOAD_EXCHANGE_JOB_COMPARISONS_SUCCESS  = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons Success';
export const LOAD_EXCHANGE_JOB_COMPARISONS_ERROR = '[Peer Main/Exchange Job Comparisons] Load Exchange Job Comparisons Error';

export class LoadExchangeJobComparisons implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS;
}

export class LoadExchangeJobComparisonsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadExchangeJobComparisonsError implements Action {
  readonly type = LOAD_EXCHANGE_JOB_COMPARISONS_ERROR;
}

export type Actions
  = LoadExchangeJobComparisons
  | LoadExchangeJobComparisonsSuccess
  | LoadExchangeJobComparisonsError;
