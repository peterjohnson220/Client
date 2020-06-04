import { Action } from '@ngrx/store';

export const SAVE_CONFIGURATION = '[Org Data Autoloader/Org Data Loader Configuration] Saving Configuration';
export const SAVE_CONFIGURATION_SUCCESS = '[Org Data Autoloader/Org Data Loader Configuration] Saving Configuration Success';
export const SAVE_CONFIGURATION_ERROR = '[Org Data Autoloader/Org Data Loader Configuration] Saving Configuration Error';

export class SaveConfiguration implements Action {
  readonly type = SAVE_CONFIGURATION;

  constructor(public payload: any) {}
}

export class SaveConfigurationSuccess implements Action {
  readonly type = SAVE_CONFIGURATION_SUCCESS;

  constructor(public payload = null) {}
}

export class SaveConfigurationError implements Action {
  readonly type = SAVE_CONFIGURATION_ERROR;

  constructor(public payload = null) {}
}

export type Actions =
  SaveConfiguration
  | SaveConfigurationSuccess
  | SaveConfigurationError;
