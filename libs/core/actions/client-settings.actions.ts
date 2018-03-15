import {Action} from '@ngrx/store';
import {ClientSettingRequestModel} from 'libs/models/common';
import { Feature, Tile } from '../../../apps/dashboard/src/app/_main/models';

export const SAVING_CLIENT_SETTING = '[ClientSettings] Saving Client Setting';
export const SAVING_CLIENT_SETTING_SUCCESS = '[ClientSettings] Saving Client Setting Success';
export const SAVING_CLIENT_SETTING_ERROR = '[ClientSettings] Saving Client Setting Error';

export class SavingClientSetting implements Action {
  readonly type  = SAVING_CLIENT_SETTING;

  constructor(public payload: any) {}
}

export class SavingClientSettingSuccess implements Action {
  readonly type = SAVING_CLIENT_SETTING_SUCCESS;

  // constructor(public payload: ClientSettingRequestModel) {}
  constructor(public payload: any) {}
}

export class SavingClientSettingError implements Action {
  type = SAVING_CLIENT_SETTING_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = SavingClientSetting
  | SavingClientSettingSuccess
  | SavingClientSettingError;
