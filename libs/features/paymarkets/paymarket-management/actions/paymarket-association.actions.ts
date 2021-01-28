import { Action } from '@ngrx/store';

import { PayMarketAssociationsSummary } from 'libs/models';

export const LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY = '[Pay Market Management / Pay Market Associations] Load Paymarkets Association Summary';
export const LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_SUCCESS = '[Pay Market Management / Pay Market Associations] Load Paymarkets Association Summary Success';
export const LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_ERROR = '[Pay Market Management / Pay Market Associations] Load Paymarkets Association Summary Failure';

export class LoadPaymarketAssociationsSummary implements Action {
  readonly type = LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY;
  constructor(public payload: number) {}
}

export class LoadPaymarketAssociationsSummarySuccess implements Action {
  readonly type = LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_SUCCESS;
  constructor(public payload: PayMarketAssociationsSummary) {}
}

export class LoadPaymarketAssociationsSummaryError implements Action {
  readonly type = LOAD_PAYMARKET_ASSOCIATIONS_SUMMARY_ERROR;
  constructor() {}
}

export type Actions
  = LoadPaymarketAssociationsSummary
  | LoadPaymarketAssociationsSummarySuccess
  | LoadPaymarketAssociationsSummaryError;
