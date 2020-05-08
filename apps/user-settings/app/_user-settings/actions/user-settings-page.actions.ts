import { Action } from '@ngrx/store';

export const LOAD_USER_SETTINGS  = '[User Settings / User Settings Page] Load User Settings';

export class LoadUserSettings implements Action {
  readonly type = LOAD_USER_SETTINGS;

  constructor() {}
}

export type Actions
  = LoadUserSettings;
