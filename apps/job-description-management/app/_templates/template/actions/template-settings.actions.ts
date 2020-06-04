import { Action } from '@ngrx/store';

import { TemplateSettings, TemplateSettingsSection, TemplateSettingsControl, SaveError } from 'libs/models';

export const LOAD_SETTINGS = '[JobDescription/Template Settings] Load Settings';
export const LOAD_SETTINGS_SUCCESS = '[JobDescription/Template Settings] Load Settings Success';
export const LOAD_SETTINGS_ERROR = '[JobDescription/Template Settings] Load Settings Error';

export const SAVE_SETTINGS = '[JobDescription/Template Settings] Save Settings';
export const SAVE_SETTINGS_SUCCESS = '[JobDescription/Template Settings] Save Settings Success';
export const SAVE_SETTINGS_ERROR = '[JobDescription/Template Settings] Save Settings Error';

export const CREATE_SETTINGS = '[JobDescription/Template Settings] Create Settings';

export const UPDATE_SECTION_SETTING = '[JobDescription/Template Settings] Update Section Setting';
export const UPDATE_CONTROL_SETTING = '[JobDescription/Template Settings] Update Control Setting';

export class LoadSettings implements Action {
    readonly type = LOAD_SETTINGS;
    constructor(public payload: {templateId: number}) {}
}

export class LoadSettingsSuccess implements Action {
    readonly type = LOAD_SETTINGS_SUCCESS;
    constructor(public payload: TemplateSettings) {}
}

export class LoadSettingsError implements Action {
    readonly type = LOAD_SETTINGS_ERROR;
    constructor(public payload: {errorMessage: string}) {}
}

export class SaveSettings implements Action {
    readonly type = SAVE_SETTINGS;
    constructor(public payload: TemplateSettings) {}
}

export class SaveSettingsSuccess implements Action {
    readonly type = SAVE_SETTINGS_SUCCESS;
    constructor(public payload: TemplateSettings) {}
}

export class SaveSettingsError implements Action {
    readonly type = SAVE_SETTINGS_ERROR;
    constructor(public payload: {error: SaveError}) {}
}

export class CreateSettings implements Action {
    readonly type = CREATE_SETTINGS;
    constructor(public payload: {templateId: number}) {}
}

export class UpdateSectionSetting implements Action {
    readonly type = UPDATE_SECTION_SETTING;
    constructor(public payload: TemplateSettingsSection) {}
}

export class UpdateControlSetting implements Action {
    readonly type = UPDATE_CONTROL_SETTING;
    constructor(public payload: TemplateSettingsControl) {}
}

export type TemplateSettingsAction = LoadSettings
| LoadSettingsSuccess
| LoadSettingsError
| SaveSettings
| SaveSettingsSuccess
| SaveSettingsError
| CreateSettings
| UpdateSectionSetting
| UpdateControlSetting;
