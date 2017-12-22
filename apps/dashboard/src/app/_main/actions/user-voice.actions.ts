import { Action } from '@ngrx/store';

import { UserVoiceLink } from 'libs/models/navigation/user-voice-link.model';

export const LOADING_USER_VOICE =  '[Dashboard/User Voice] Loading User Voice';
export const LOADING_USER_VOICE_SUCCESS =  '[Dashboard/User Voice] Loading User Voice Success';
export const LOADING_USER_VOICE_ERROR =  '[Dashboard/User Voice] Loading User Voice Error';

export class LoadingUserVoice implements Action {
  readonly type = LOADING_USER_VOICE;
}

export class LoadingUserVoiceSuccess implements Action {
  readonly type = LOADING_USER_VOICE_SUCCESS;

  constructor(public payload: UserVoiceLink) {}
}

export class LoadingUserVoiceError implements Action {
  readonly type = LOADING_USER_VOICE_ERROR;

  constructor(public any: Error) {}
}

export type Actions
  = LoadingUserVoice
  | LoadingUserVoiceSuccess
  | LoadingUserVoiceError;
