import { Action } from '@ngrx/store';

import { NavigationLink } from 'libs/models';

export const LOADING_USER_VOICE =  '[Dashboard/User Voice] Loading User Voice';
export const LOADING_USER_VOICE_SUCCESS =  '[Dashboard/User Voice] Loading User Voice Success';
export const LOADING_USER_VOICE_ERROR =  '[Dashboard/User Voice] Loading User Voice Error';

export class LoadingUserVoice implements Action {
  readonly type = LOADING_USER_VOICE;
}

export class LoadingUserVoiceSuccess implements Action {
  readonly type = LOADING_USER_VOICE_SUCCESS;

  constructor(public payload: NavigationLink) {}
}

export class LoadingUserVoiceError implements Action {
  readonly type = LOADING_USER_VOICE_ERROR;

  constructor(public any: Error) {}
}

export type Actions
  = LoadingUserVoice
  | LoadingUserVoiceSuccess
  | LoadingUserVoiceError;
