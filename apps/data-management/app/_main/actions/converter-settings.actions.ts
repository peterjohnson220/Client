import { Action } from '@ngrx/store';

import { ConverterSettings } from 'libs/models';

export const GET_CONVERTER_SETTINGS = '[Data Management/Converter Settings] Get Converter Settings';
export const GET_CONVERTER_SETTINGS_ERROR = '[Data Management/Converter Settings] Get Converter Settings Error';
export const GET_CONVERTER_SETTINGS_SUCCESS = '[Data Management/Converter Settings] Get Converter Settings Success';



export const SAVE_CONVERTER_SETTINGS = '[Data Management/Converter Settings] Save Converter Settings';
export const SAVE_CONVERTER_SETTINGS_ERROR = '[Data Management/Converter Settings] Save Converter Settings Error';
export const SAVE_CONVERTER_SETTINGS_SUCCESS = '[Data Management/Converter Settings] Save Converter Settings Success';

export const ADD_CONVERTER_SETTING = '[Data Management/Converter Settings] Add Converter Setting';
export const ADD_CONVERTER_SETTING_ERROR = '[Data Management/Converter Settings] Add Converter Setting Error';
export const ADD_CONVERTER_SETTING_SUCCESS = '[Data Management/Converter Settings] Add Converter Setting Success';

export const REMOVE_CONVERTER_SETTING = '[Data Management/Converter Settings] Remove Converter Setting';
export const REMOVE_CONVERTER_SETTING_ERROR = '[Data Management/Converter Settings] Remove Converter Setting Error';
export const REMOVE_CONVERTER_SETTING_SUCCESS = '[Data Management/Converter Settings] Remove Converter Setting Success';

export const OPEN_DATA_CONVERTER_MODAL = '[Data Management/Converter Settings] Open Converter Settings Modal';

export class GetConverterSettings implements Action {
  readonly type = GET_CONVERTER_SETTINGS;

}
export class GetConverterSettingsError implements Action {
  readonly type = GET_CONVERTER_SETTINGS_ERROR;

}
export class GetConverterSettingsSuccess implements Action {
  readonly type = GET_CONVERTER_SETTINGS_SUCCESS;

  constructor(public payload: any) {}
}

export class SaveConverterSettings implements Action {
  readonly type = SAVE_CONVERTER_SETTINGS;
}
export class SaveConverterSettingsError implements Action {
  readonly type = SAVE_CONVERTER_SETTINGS_ERROR;
}
export class SaveConverterSettingsSuccess implements Action {
  readonly type = SAVE_CONVERTER_SETTINGS_SUCCESS;
}

export class AddConverterSetting implements Action {
  readonly type = ADD_CONVERTER_SETTING;

  constructor(public payload: {converterSetting?: ConverterSettings, fieldName?: string, entityType?: string, connectionId?: number}) {}
}
export class AddConverterSettingError implements Action {
  readonly type = ADD_CONVERTER_SETTING_ERROR;
}
export class AddConverterSettingSuccess implements Action {
  readonly type = ADD_CONVERTER_SETTING_SUCCESS;
}

export class RemoveConverterSetting implements Action {
  readonly type = REMOVE_CONVERTER_SETTING;

  constructor(public payload: {fieldName: string, entityType: string, connectionId: number}) {}
}
export class RemoveConverterSettingError implements Action {
  readonly type = REMOVE_CONVERTER_SETTING_ERROR;
}
export class RemoveConverterSettingSuccess implements Action {
  readonly type = REMOVE_CONVERTER_SETTING_SUCCESS;
}

export class OpenDataConverterModal implements Action {
  readonly type = OPEN_DATA_CONVERTER_MODAL;

  constructor(public payload: {
    open: boolean,
    modalInfo: {
      fieldName: string,
      connectionId: number,
      dataType: string,
      entityType: string,
      provider: string
    }
  }) {}
}


export type Actions
  = GetConverterSettings
  | GetConverterSettingsError
  | GetConverterSettingsSuccess
  | SaveConverterSettings
  | SaveConverterSettingsError
  | SaveConverterSettingsSuccess
  | AddConverterSetting
  | AddConverterSettingError
  | AddConverterSettingSuccess
  | OpenDataConverterModal
  | RemoveConverterSetting
  | RemoveConverterSettingError
  | RemoveConverterSettingSuccess;
