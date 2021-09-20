import { Action } from '@ngrx/store';

import {
  ConvertCurrencyAndRateRequestModel,
  GetStructureHasSettingsRequestModel,
} from 'libs/models/payfactors-api/structures/request';

export const CONVERT_CURRENCY_AND_RATE = '[Structures - Job Based Range - Shared] Convert Currency And Rate';
export const CONVERT_CURRENCY_AND_RATE_SUCCESS = '[Structures - Job Based Range - Shared] Convert Currency And Rate Success';
export const CONVERT_CURRENCY_AND_RATE_ERROR = '[Structures - Job Based Range - Shared] Convert Currency And Rate Error';

export class ConvertCurrencyAndRate implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE;

  constructor(public payload: ConvertCurrencyAndRateRequestModel) {}
}

export class ConvertCurrencyAndRateSuccess implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_SUCCESS;

  constructor(public payload: any) {}
}

export class ConvertCurrencyAndRateError implements Action {
  readonly type = CONVERT_CURRENCY_AND_RATE_ERROR;

  constructor(public payload: any) {}
}

export type SharedActions
  = ConvertCurrencyAndRate
  | ConvertCurrencyAndRateSuccess
  | ConvertCurrencyAndRateError;


