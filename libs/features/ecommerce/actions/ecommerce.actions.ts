import { Action } from '@ngrx/store';

import { ECommerceSettings } from 'libs/models/payfactors-api/ecommerce';

export const GET_SETTINGS = '[Feature ECommerce] Get Settings';
export const GET_SETTINGS_SUCCESS = '[Feature ECommerce] Get Settings Success';
export const GET_SETTINGS_ERROR = '[Feature ECommerce] Get Settings Error';

export class GetSettings implements Action {
  readonly type = GET_SETTINGS;
}

export class GetSettingsSuccess implements Action {
  readonly type = GET_SETTINGS_SUCCESS;

  constructor(public payload: { settings: ECommerceSettings }) {}
}

export class GetSettingsError implements Action {
  readonly type = GET_SETTINGS_ERROR;
}

export type Actions
  = GetSettings
  | GetSettingsSuccess
  | GetSettingsError;
