import { Action } from '@ngrx/store';

import { CompanySetting } from '../../../models';

export const LOAD_COMPANY_SETTINGS = '[AppContext/Company Settings] Load Company Settings';
export const LOAD_COMPANY_SETTINGS_SUCCESS = '[AppContext/Company Settings] Load Company Settings Success';
export const LOAD_COMPANY_SETTINGS_ERROR = '[AppContext/Company Settings] Load Company Settings Error';

export class LoadCompanySettings implements Action {
  readonly type = LOAD_COMPANY_SETTINGS;
}

export class LoadCompanySettingsSuccess implements Action {
  readonly type = LOAD_COMPANY_SETTINGS_SUCCESS;

  constructor(public payload: CompanySetting[]) {}
}

export class LoadCompanySettingsError implements Action {
  readonly type = LOAD_COMPANY_SETTINGS_ERROR;

  constructor(public error: any) {}
}

export type Actions =
  | LoadCompanySettings
  | LoadCompanySettingsSuccess
  | LoadCompanySettingsError;
