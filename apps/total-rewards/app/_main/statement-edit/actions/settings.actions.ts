import { Action } from '@ngrx/store';
import { Settings } from '../../../shared/models';
import * as requestModels from '../../../shared/models/request-models';
import { FontSize, FontFamily } from '../../../shared/types';

export const OPEN_SETTINGS = '[Total Rewards/Edit Statement] Open Settings';
export const CLOSE_SETTINGS = '[Total Rewards/Edit Statement] Close Settings';
export const SAVE_SETTINGS = '[Total Rewards/Edit Statement] Save Settings';
export const SAVE_SETTINGS_SUCCESS = '[Total Rewards/Edit Statement] Save Settings Success';
export const SAVE_SETTINGS_ERROR = '[Total Rewards/Edit Statement] Save Settings Error';
export const UPDATE_SETTINGS_FONT_SIZE = '[Total Rewards/Edit Statement] Update Settings Font Size';
export const UPDATE_SETTINGS_FONT_FAMILY = '[Total Rewards/Edit Statement] Update Settings Font Family';
export const UPDATE_SETTINGS_CHART_COLOR = '[Total Rewards/Edit Statement] Update Settings Chart Color';
export const RESET_SETTINGS = '[Total Rewards/Edit Statement] Reset Settings';

export class OpenSettings implements Action {
  readonly type = OPEN_SETTINGS;
}

export class CloseSettings implements Action {
  readonly type = CLOSE_SETTINGS;
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

export class UpdateSettingsChartColor implements Action {
  readonly type = UPDATE_SETTINGS_CHART_COLOR;
  constructor(public payload: requestModels.UpdateSettingsChartColorRequest) {}
}

export class ResetSettings implements Action {
  readonly type = RESET_SETTINGS;
}

export type SettingsActions =
  OpenSettings |
  CloseSettings |
  SaveSettings |
  SaveSettingsSuccess |
  SaveSettingsError |
  UpdateSettingsFontSize |
  UpdateSettingsFontFamily |
  UpdateSettingsChartColor |
  ResetSettings;
