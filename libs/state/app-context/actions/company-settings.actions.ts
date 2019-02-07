import { Action } from '@ngrx/store';

import { CompanySetting } from '../../../models';
import { CompanySettingsSaveRequest } from '../../../models/payfactors-api/settings/request';

export const LOAD_COMPANY_SETTINGS = '[AppContext/Company Settings] Load Company Settings';
export const LOAD_COMPANY_SETTINGS_SUCCESS = '[AppContext/Company Settings] Load Company Settings Success';
export const LOAD_COMPANY_SETTINGS_ERROR = '[AppContext/Company Settings] Load Company Settings Error';

export const PUT_COMPANY_SETTINGS = '[AppContext/Company Settings New] Put Company Settings';
export const PUT_COMPANY_SETTINGS_SUCCESS = '[AppContext/Company Settings New] Put Company Settings Success';
export const PUT_COMPANY_SETTINGS_ERROR = '[AppContext/Company Settings New] Put Company Settings Error';

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

export class PutCompanySettings implements Action {
  readonly type = PUT_COMPANY_SETTINGS;

  constructor(public payload: CompanySettingsSaveRequest) {}
}

export class PutCompanySettingsSuccess implements Action {
  readonly type = PUT_COMPANY_SETTINGS_SUCCESS;

  constructor(public payload: CompanySetting[]) {}
}

export class PutCompanySettingsError implements Action {
  readonly type = PUT_COMPANY_SETTINGS_ERROR;

  constructor(public error: any) {}
}

export type Actions =
  | LoadCompanySettings
  | LoadCompanySettingsSuccess
  | LoadCompanySettingsError
  | PutCompanySettings
  | PutCompanySettingsSuccess
  | PutCompanySettingsError;
