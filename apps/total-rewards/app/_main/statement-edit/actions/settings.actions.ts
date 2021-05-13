import { Action } from '@ngrx/store';

import { Settings } from 'libs/features/total-rewards/total-rewards-statement/models';
import * as requestModels from 'libs/features/total-rewards/total-rewards-statement/models/request-models';
import { FontSize, FontFamily } from 'libs/features/total-rewards/total-rewards-statement/types';
import { StatementAdditionalPageSettings } from 'libs/features/total-rewards/total-rewards-statement/models/statement-additional-page-settings';

export const OPEN_SETTINGS_PANEL = '[Total Rewards/Edit Statement] Open Settings Panel';
export const CLOSE_SETTINGS_PANEL = '[Total Rewards/Edit Statement] Close Settings Panel';
export const SAVE_SETTINGS = '[Total Rewards/Edit Statement] Save Settings';
export const PREPARE_SAVE_SETTINGS = '[Total Rewards/Edit Statement] Prepare Save Settings';
export const SAVE_SETTINGS_SUCCESS = '[Total Rewards/Edit Statement] Save Settings Success';
export const SAVE_SETTINGS_ERROR = '[Total Rewards/Edit Statement] Save Settings Error';
export const UPDATE_SETTINGS_FONT_SIZE = '[Total Rewards/Edit Statement] Update Settings Font Size';
export const UPDATE_SETTINGS_FONT_FAMILY = '[Total Rewards/Edit Statement] Update Settings Font Family';
export const UPDATE_SETTINGS_COLOR = '[Total Rewards/Edit Statement] Update Settings Color';
export const TOGGLE_DISPLAY_SETTING = '[Total Rewards/Edit Statement] Toggle Display Setting';
export const RESET_SETTINGS = '[Total Rewards/Edit Statement] Reset Settings';
export const UPDATE_ADDITIONAL_PAGE_SETTINGS = '[Total Rewards/Edit Statement] Update Additional Page Setting';

export class OpenSettingsPanel implements Action {
  readonly type = OPEN_SETTINGS_PANEL;
}

export class CloseSettingsPanel implements Action {
  readonly type = CLOSE_SETTINGS_PANEL;
}

export class PrepareSaveSettings implements Action {
  readonly type = PREPARE_SAVE_SETTINGS;
}

export class SaveSettings implements Action {
  readonly type = SAVE_SETTINGS;
}

export class SaveSettingsSuccess implements Action {
  readonly type = SAVE_SETTINGS_SUCCESS;
  constructor(public payload: Settings) {}
}

export class SaveSettingsError implements Action {
  readonly type = SAVE_SETTINGS_ERROR;
}

export class UpdateSettingsFontSize implements Action {
  readonly type = UPDATE_SETTINGS_FONT_SIZE;
  constructor(public payload: FontSize) {}
}

export class UpdateSettingsFontFamily implements Action {
  readonly type = UPDATE_SETTINGS_FONT_FAMILY;
  constructor(public payload: FontFamily) {}
}

export class UpdateSettingsColor implements Action {
  readonly type = UPDATE_SETTINGS_COLOR;
  constructor(public payload: requestModels.UpdateSettingsColorRequest) {}
}

export class ToggleDisplaySetting implements Action {
  readonly type = TOGGLE_DISPLAY_SETTING;
  constructor(public payload: { displaySettingKey: string }) {}
}

export class UpdateAdditionalPageSettings implements Action {
  readonly type = UPDATE_ADDITIONAL_PAGE_SETTINGS;
  constructor(public payload: { additionalPageSettings: StatementAdditionalPageSettings }) {}
}

export class ResetSettings implements Action {
  readonly type = RESET_SETTINGS;
}

export type SettingsActions =
  OpenSettingsPanel |
  CloseSettingsPanel |
  PrepareSaveSettings |
  SaveSettings |
  SaveSettingsSuccess |
  SaveSettingsError |
  UpdateSettingsFontSize |
  UpdateSettingsFontFamily |
  UpdateSettingsColor |
  ToggleDisplaySetting |
  ResetSettings |
  UpdateAdditionalPageSettings;
