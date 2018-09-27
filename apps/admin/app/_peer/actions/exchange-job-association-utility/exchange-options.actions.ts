import { Action } from '@ngrx/store';

import { GenericKeyValue } from 'libs/models/common';

export const LOAD_EXCHANGE_OPTIONS  = '[Peer Admin/Exchange Job Association Import/Exchange Options] Load Exchange Options';
export const LOAD_EXCHANGE_OPTIONS_SUCCESS  = '[Peer Admin/Exchange Job Association Import/Exchange Options] Load Exchange Options Success';
export const LOAD_EXCHANGE_OPTIONS_ERROR  = '[Peer Admin/Exchange Job Association Import/Exchange Options] Load Exchange Options Error';

export class LoadExchangeOptions implements Action {
  readonly type = LOAD_EXCHANGE_OPTIONS;

  constructor(public payload: number) {}
}

export class LoadExchangeOptionsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_OPTIONS_SUCCESS;

  constructor(public payload: GenericKeyValue<number, string>[]) {}
}

export class LoadExchangeOptionsError implements Action {
  readonly type = LOAD_EXCHANGE_OPTIONS_ERROR;
}

export type Actions
  = LoadExchangeOptions
  | LoadExchangeOptionsSuccess
  | LoadExchangeOptionsError;
