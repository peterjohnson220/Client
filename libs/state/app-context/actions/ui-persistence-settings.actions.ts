import { Action } from '@ngrx/store';
import { SaveUiPersistenceSettingRequest, GenericNameValueDto } from '../../../models/common';

export const GET_UI_PERSISTENCE_SETTINGS = '[UiPersistenceSettings] Get UI Persistence Settings';
export const GET_UI_PERSISTENCE_SETTINGS_SUCCESS = '[UiPersistenceSettings] Get UI Persistence Setting Success';
export const GET_UI_PERSISTENCE_SETTINGS_ERROR = '[UiPersistenceSettings] Get UI Persistence Setting Error';
export const SAVE_UI_PERSISTENCE_SETTING = '[UiPersistenceSettings] Saving UI Persistence Setting';
export const SAVE_UI_PERSISTENCE_SETTING_SUCCESS = '[UiPersistenceSettings] Saving UI Persistence Setting Success';
export const SAVE_UI_PERSISTENCE_SETTING_ERROR = '[UiPersistenceSettings] Saving UI Persistence Setting Error';

export class GetUiPersistenceSettings implements Action {
  readonly type = GET_UI_PERSISTENCE_SETTINGS;
  constructor(public payload: any) {
  }
}

export class GetUiPersistenceSettingsSuccess implements Action {
  readonly type = GET_UI_PERSISTENCE_SETTINGS_SUCCESS;
  constructor(public payload: GenericNameValueDto[]) {}
}

export class GetUiPersistenceSettingsError implements  Action {
  readonly type = GET_UI_PERSISTENCE_SETTINGS_ERROR;
  constructor(public payload: any) {}
}

export class SaveUiPersistenceSetting implements Action {
  readonly type  = SAVE_UI_PERSISTENCE_SETTING;
  constructor(public payload: SaveUiPersistenceSettingRequest) {}
}

export class SaveUiPersistenceSettingSuccess implements Action {
  readonly type = SAVE_UI_PERSISTENCE_SETTING_SUCCESS;

  constructor(public payload: GenericNameValueDto[]) {}
}

export class SaveUiPersistenceSettingError implements Action {
  type = SAVE_UI_PERSISTENCE_SETTING_ERROR;
  constructor(public payload: any) {}
}

export type Actions =
  | GetUiPersistenceSettings
  | GetUiPersistenceSettingsSuccess
  | GetUiPersistenceSettingsError
  | SaveUiPersistenceSetting
  | SaveUiPersistenceSettingSuccess
  | SaveUiPersistenceSettingError;
