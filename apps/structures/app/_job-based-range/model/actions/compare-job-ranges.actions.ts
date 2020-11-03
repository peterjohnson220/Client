import { Action } from '@ngrx/store';

import { ConvertCurrencyAndRateRequestModel } from 'libs/models/payfactors-api/structures/request';

export const GET_DATA_FOR_COMPARE = '[Structures - Compare Job Based Ranges] Get Data For Compare';
export const GET_DATA_FOR_COMPARE_SUCCESS = '[Structures - Compare Job Based Ranges] Get Data For Compare Success';
export const GET_DATA_FOR_COMPARE_ERROR = '[Structures - Compare Job Based Ranges] Get Data For Compare Error';
export const LOAD_MORE_COMPARE_DATA = '[Structures - Compare Job Based Ranges] Load More Data For Compare';
export const LOAD_MORE_COMPARE_DATA_SUCCESS = '[Structures - Compare Job Based Ranges] Load More Data For Compare Success';
export const CONVERT_CURRENCY_AND_RATE = '[Structures - Compare Job Based Ranges] Convert Currency And Rate';
export const APPEND_CONVERT_CURRENCY_AND_RATE = '[Structures - Compare Job Based Ranges] Append Convert Currency And Rate';
export const APPEND_CONVERT_CURRENCY_AND_RATE_SUCCESS = '[Structures - Compare Job Based Ranges] Append Convert Currency And Rate Success';
export const CONVERT_CURRENCY_AND_RATE_SUCCESS = '[Structures - Compare Job Based Ranges] Convert Currency And Rate Success';
export const CONVERT_CURRENCY_AND_RATE_ERROR = '[Structures - Compare Job Based Ranges] Convert Currency And Rate Error';
export const NO_OPERATION_ACTION = '[Structures - Compare Job Based Ranges] No Operation Action';


export class GetDataForCompare implements Action {
  readonly type = GET_DATA_FOR_COMPARE;

  constructor(public pageViewId: string ) {}
}

export class GetDataForCompareSuccess implements Action {
  readonly type = GET_DATA_FOR_COMPARE_SUCCESS;

  constructor(public payload: any) {}
}

export class GetDataForCompareError implements Action {
  readonly type = GET_DATA_FOR_COMPARE_ERROR;

  constructor(public payload: any) {}
}

export class LoadMoreCompareData implements Action {
  readonly type = LOAD_MORE_COMPARE_DATA;

  constructor(public pageViewId: string) {}
}

export class LoadMoreCompareDataSuccess implements Action {
  readonly type = LOAD_MORE_COMPARE_DATA_SUCCESS;

  constructor(public payload: any) {}
}

export class ConvertCurrencyAndRate implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE;

  constructor(public payload: ConvertCurrencyAndRateRequestModel) {}
}

export class AppendConvertCurrencyAndRate implements Action {
  readonly type = APPEND_CONVERT_CURRENCY_AND_RATE;

  constructor(public payload: ConvertCurrencyAndRateRequestModel) {}

}

export class AppendConvertCurrencyAndRateSuccess implements Action {
  readonly type = APPEND_CONVERT_CURRENCY_AND_RATE_SUCCESS;

  constructor(public payload: any) {}
}

export class ConvertCurrencyAndRateSuccess implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_SUCCESS;

  constructor(public payload: any) {}
}

export class ConvertCurrencyAndRateError implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_ERROR;

  constructor(public payload: any) {}
}

export class NoOperationAction implements Action {
  readonly type = NO_OPERATION_ACTION;
}

export type CompareJobRangesActions =
  | GetDataForCompare
  | GetDataForCompareSuccess
  | GetDataForCompareError
  | LoadMoreCompareData
  | LoadMoreCompareDataSuccess
  | ConvertCurrencyAndRate
  | ConvertCurrencyAndRateSuccess
  | ConvertCurrencyAndRateError
  | AppendConvertCurrencyAndRate
  | AppendConvertCurrencyAndRateSuccess
  | NoOperationAction;
