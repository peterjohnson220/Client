import { Action } from '@ngrx/store';

import { UserProfile } from 'libs/models/user-profile';

export const SET_USER_PROFILE = '[UserSettings - My Profile Tab] Set User Profile';
export const SAVE_USER_PROFILE = '[UserSettings - My Profile Tab] Save User Profile';
export const SAVE_USER_PROFILE_SUCCESS = '[UserSettings - My Profile Tab] Save User Profile Success';
export const SAVE_USER_PROFILE_ERROR = '[UserSettings - My Profile Tab] Save User Profile Error';

export class SetUserProfile implements Action {
  readonly type = SET_USER_PROFILE;
  constructor(public payload: { userProfile: UserProfile, cloudFilesPublicBaseUrl: string }) {}
}

export class SaveUserProfile implements Action {
  readonly type = SAVE_USER_PROFILE;

  constructor(public payload: UserProfile) {}
}

export class SaveUserProfileSuccess implements Action {
  readonly type = SAVE_USER_PROFILE_SUCCESS;
  constructor(public payload: UserProfile) {}
}

export class SaveUserProfileError implements Action {
  readonly type = SAVE_USER_PROFILE_ERROR;
  constructor() {}
}

export type Actions
  = SetUserProfile
  | SaveUserProfile
  | SaveUserProfileSuccess
  | SaveUserProfileError;
