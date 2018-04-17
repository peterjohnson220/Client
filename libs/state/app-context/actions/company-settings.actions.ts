import { Action } from '@ngrx/store';

import { CompanySettingDto } from '../../../models';

export const GET_COMPANY_SETTINGS = '[AppContext/Company Settings] Get Company Settings';
export const GET_COMPANY_SETTINGS_SUCCESS = '[AppContext/Company Settings] Get Company Settings Success';
export const GET_COMPANY_SETTINGS_ERROR = '[AppContext/Company Settings] Get Company Settings Error';

export class GetCompanySettings implements Action {
  readonly type = GET_COMPANY_SETTINGS;

  constructor() {
  }
}

export class GetCompanySettingsSuccess implements Action {
  readonly type = GET_COMPANY_SETTINGS_SUCCESS;

  constructor(public payload: CompanySettingDto[]) {
  }
}

export class GetCompanySettingsError implements Action {
  readonly type = GET_COMPANY_SETTINGS_ERROR;

  constructor(public error: any) {
  }
}

export type Actions =
  | GetCompanySettings
  | GetCompanySettingsSuccess
  | GetCompanySettingsError;
