import { Action } from '@ngrx/store';

import { LoaderSettingKeyName } from 'libs/models/data-loads';

export const UPDATE_DEFAULT_SETTING = '[Pricing Loader/ Pricing Loader Defaults] Update Default Setting';
export const RESET_DEFAULT_SETTINGS_STATE = '[Pricing Loader/ Pricing Loader Defaults] Reset Default Settings State';

export class UpdateDefaultSetting implements Action {
  readonly type = UPDATE_DEFAULT_SETTING;
  constructor(public payload: { keyName: LoaderSettingKeyName, numericValue: number }) {}
}

export class ResetDefaultSettingsState implements Action {
  readonly type = RESET_DEFAULT_SETTINGS_STATE;
  constructor() {}
}

export type Actions
  = UpdateDefaultSetting
  | ResetDefaultSettingsState;
