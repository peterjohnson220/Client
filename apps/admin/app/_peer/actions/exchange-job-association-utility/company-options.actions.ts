import { Action } from '@ngrx/store';

import { GenericKeyValue } from 'libs/models/common';

export const LOAD_COMPANY_OPTIONS  = '[Peer Admin/Exchange Job Association Import/Company Options] Load Company Options';
export const LOAD_COMPANY_OPTIONS_SUCCESS  = '[Peer Admin/Exchange Job Association Import/Company Options] Load Company Options Success';
export const LOAD_COMPANY_OPTIONS_ERROR  = '[Peer Admin/Exchange Job Association Import/Company Options] Load Company Options Error';

export class LoadCompanyOptions implements Action {
  readonly type = LOAD_COMPANY_OPTIONS;
}

export class LoadCompanyOptionsSuccess implements Action {
  readonly type = LOAD_COMPANY_OPTIONS_SUCCESS;

  constructor(public payload: GenericKeyValue<number, string>[]) {}
}

export class LoadCompanyOptionsError implements Action {
  readonly type = LOAD_COMPANY_OPTIONS_ERROR;
}

export type Actions
  = LoadCompanyOptions
  | LoadCompanyOptionsSuccess
  | LoadCompanyOptionsError;
