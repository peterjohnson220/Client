import { Action } from '@ngrx/store';
import { LoaderSetting, LoaderSettingsDTO } from 'libs/models/data-loads';

export const LOADING_LOADER_SETTINGS = '[Org Data Loader/Loader Settings] Loading Loader Settings';
export const LOADING_LOADER_SETTINGS_SUCCESS = '[Org Data Loader/Loader Settings] Loading Loader Settings Success';
export const LOADING_LOADER_SETTINGS_ERROR = '[Org Data Loader/Loader Settings] Loading Loader Settings Error';
export const SAVING_LOADER_SETTINGS = '[Org Data Loader/Loader Settings] Saving Loader Settings';
export const SAVING_LOADER_SETTINGS_SUCCESS = '[Org Data Loader/Loader Settings] Saving Loader Settings Success';
export const SAVING_LOADER_SETTINGS_ERROR = '[Org Data Loader/Loader Settings] Saving Loader Settings Error';

export class LoadingLoaderSettings implements Action {
  readonly type = LOADING_LOADER_SETTINGS;

  constructor(public companyId: number, public configGroupId: number = null) { }
}
export class LoadingLoaderSettingsSuccess implements Action {
  readonly type = LOADING_LOADER_SETTINGS_SUCCESS;

  constructor(public payload: LoaderSetting[]) { }
}
export class LoadingLoaderSettingsError implements Action {
  readonly type = LOADING_LOADER_SETTINGS_ERROR;

}

export class SavingLoaderSettings implements Action {
  readonly type = SAVING_LOADER_SETTINGS;

  constructor(public payload: LoaderSettingsDTO) { }
}

export class SavingLoaderSettingsSuccess implements Action {
  readonly type = SAVING_LOADER_SETTINGS_SUCCESS;
}

export class SavingLoaderSettingsError implements Action {
  readonly type = SAVING_LOADER_SETTINGS_ERROR;
}

export type Actions
  = LoadingLoaderSettings
  | LoadingLoaderSettingsSuccess
  | LoadingLoaderSettingsError
  | SavingLoaderSettings
  | SavingLoaderSettingsSuccess
  | SavingLoaderSettingsError;
