import { Action } from '@ngrx/store';

import { LegacyCompanySettingDto } from '../../../models';

export const GET_COMPANY_SETTINGS = '[AppContext/Legacy Company Settings] Get Legacy Company Settings';
export const GET_COMPANY_SETTINGS_SUCCESS = '[AppContext/Legacy Company Settings] Get Legacy Company Settings Success';
export const GET_COMPANY_SETTINGS_ERROR = '[AppContext/Legacy Company Settings] Get Legacy Company Settings Error';

export class GetCompanySettings implements Action {
  readonly type = GET_COMPANY_SETTINGS;

  constructor() {
  }
}

export class GetCompanySettingsSuccess implements Action {
  readonly type = GET_COMPANY_SETTINGS_SUCCESS;

  constructor(public payload: LegacyCompanySettingDto[]) {
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
