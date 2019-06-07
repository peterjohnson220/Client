import { Action } from '@ngrx/store';

import { CompanySetting } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

export const LOAD_PASSWORD_SETTINGS_SUCCESS = '[Company Admin - Password Management] Load Company Admin Password Settings Success';
export const LOAD_PASSWORD_SETTINGS_ERROR = '[Company Admin - Password Management] Load Company Admin Password Settings Error';
export const LOAD_PASSWORD_SETTINGS = '[Company Admin - Password Management] Load Company Admin Password Settings';
export const SAVE_PASSWORD_SETTINGS_SUCCESS = '[Company Admin - Password Management] Save Company Admin Password Settings Success';
export const SAVE_PASSWORD_SETTINGS_ERROR = '[Company Admin - Password Management] Save Company Admin Password Settings Error';
export const SAVE_PASSWORD_SETTINGS = '[Company Admin - Password Management] Save Company Admin Password Settings';
export const SAVE_PASSWORD_SETTINGS_PROMPT_OPEN = '[Company Admin - Password Management] Save Company Admin Password Settings Prompt Open';
export const SAVE_PASSWORD_SETTINGS_PROMPT_CLOSE =
  '[Company Admin - Password Management] Save Company Admin Password Settings Prompt Close';
export const SAVE_PASSWORD_SETTINGS_SUCCESS_POST =
  '[Company Admin - Password Management] Save Company Admin Password Settings Success Post';

export class LoadCompanyAdminPasswordSettings implements Action {
  readonly type = LOAD_PASSWORD_SETTINGS;
}

export class LoadCompanyAdminPasswordSettingsSuccess implements Action {
  readonly type = LOAD_PASSWORD_SETTINGS_SUCCESS;

  constructor(public payload: CompanySetting[]) {}
}

export class LoadCompanyAdminPasswordSettingsError implements Action {
  readonly type = LOAD_PASSWORD_SETTINGS_ERROR;
}

export class SaveCompanyAdminPasswordSettingsPromptOpen implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS_PROMPT_OPEN;
}

export class SaveCompanyAdminPasswordSettingsPromptClose implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS_PROMPT_CLOSE;
}

export class SaveCompanyAdminPasswordSettings implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS;

  constructor(public payload: CompanySettingsSaveRequest) {}
}

export class SaveCompanyAdminPasswordSettingsSuccess implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS_SUCCESS;
}

export class SaveCompanyAdminPasswordSettingsError implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS_ERROR;
}

export class SaveCompanyAdminPasswordSettingsSuccessPost implements Action {
  readonly type = SAVE_PASSWORD_SETTINGS_SUCCESS_POST;
}

export type PasswordSettingActions
  = LoadCompanyAdminPasswordSettings
  | LoadCompanyAdminPasswordSettingsSuccess
  | LoadCompanyAdminPasswordSettingsError
  | SaveCompanyAdminPasswordSettings
  | SaveCompanyAdminPasswordSettingsSuccess
  | SaveCompanyAdminPasswordSettingsSuccessPost
  | SaveCompanyAdminPasswordSettingsError
  | SaveCompanyAdminPasswordSettingsPromptOpen
  | SaveCompanyAdminPasswordSettingsPromptClose;
