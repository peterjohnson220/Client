import { Action } from '@ngrx/store';
import { AutoShareUser } from '../../../models/user-settings';
import { ShareUserResponse } from '../../../models/payfactors-api/user/response';

export const GET_SHAREABLE_USERS = '[User Settings / Auto Share] Get Shareable Users';
export const GET_SHAREABLE_USERS_SUCCESS = '[User Settings / Auto Share] Get Shareable Users Success';
export const GET_SHAREABLE_USERS_ERROR = '[User Settings / Auto Share] Get Shareable Users Error';
export const GET_AUTO_SHARED_USERS = '[User Settings / Auto Share] Get Auto Shared Users';
export const GET_AUTO_SHARED_USERS_SUCCESS = '[User Settings / Auto Share] Get Auto Shared Users Success';
export const GET_AUTO_SHARED_USERS_ERROR = '[User Settings / Auto Share] Get Auto Shared Users Error';
export const REMOVE_AUTO_SHARED_USER = '[User Settings / Auto Share] Remove Auto Shared User';
export const REMOVE_AUTO_SHARED_USER_SUCCESS = '[User Settings / Auto Share] Remove Auto Shared User Success';
export const REMOVE_AUTO_SHARED_USER_ERROR = '[User Settings / Auto Share] Remove Auto Shared User Error';
export const OPEN_AUTO_SHARE_MODAL = '[User Settings / Auto Share] Open Auto Share Modal';
export const CLOSE_AUTO_SHARE_MODAL = '[User Settings / Auto Share] Close Auto Share Modal';
export const TOGGLE_SELECTED_USER = '[User Settings / Auto Share] Toggle Selected User';
export const SAVE_AUTO_SHARE_USERS = '[User Settings / Auto Share] Save Auto Share Users';
export const SAVE_AUTO_SHARE_USERS_SUCCESS = '[User Settings / Auto Share] Save Auto Share Users Success';
export const SAVE_AUTO_SHARE_USERS_ERROR = '[User Settings / Auto Share] Save Auto Share Users Error';

export class GetShareableUsers implements Action {
  readonly type = GET_SHAREABLE_USERS;

  constructor() {}
}

export class GetShareableUsersSuccess implements Action {
  readonly type = GET_SHAREABLE_USERS_SUCCESS;

  constructor(public payload: AutoShareUser[]) {}
}

export class GetShareableUsersError implements Action {
  readonly type = GET_SHAREABLE_USERS_ERROR;

  constructor() {}
}

export class GetAutoSharedUsers implements Action {
  readonly type = GET_AUTO_SHARED_USERS;

  constructor(public payload: number) {}
}

export class GetAutoSharedUsersSuccess implements Action {
  readonly type = GET_AUTO_SHARED_USERS_SUCCESS;

  constructor(public payload: ShareUserResponse[]) {}
}

export class GetAutoSharedUsersError implements Action {
  readonly type = GET_AUTO_SHARED_USERS_ERROR;

  constructor() {}
}

export class RemoveAutoSharedUser implements Action {
  readonly type = REMOVE_AUTO_SHARED_USER;

  constructor(public payload: number) {}
}

export class RemoveAutoSharedUserSuccess implements Action {
  readonly type = REMOVE_AUTO_SHARED_USER_SUCCESS;

  constructor(public payload: number) {}
}

export class RemoveAutoSharedUserError implements Action {
  readonly type = REMOVE_AUTO_SHARED_USER_ERROR;

  constructor() {}
}

export class OpenAutoShareModal implements Action {
  readonly type = OPEN_AUTO_SHARE_MODAL;

  constructor() {}
}

export class CloseAutoShareModal implements Action {
  readonly type = CLOSE_AUTO_SHARE_MODAL;

  constructor() {}
}

export class SaveAutoShareUsers implements Action {
  readonly type = SAVE_AUTO_SHARE_USERS;

  constructor(public payload: number[]) {}
}

export class SaveAutoShareUsersSuccess implements Action {
  readonly type = SAVE_AUTO_SHARE_USERS_SUCCESS;

  constructor() {}
}

export class SaveAutoShareUsersError implements Action {
  readonly type = SAVE_AUTO_SHARE_USERS_ERROR;

  constructor() {}
}


export class ToggleSelectedUser implements Action {
  readonly type = TOGGLE_SELECTED_USER;

  constructor(public payload: AutoShareUser) {}
}


export type Actions
  = GetShareableUsers
  | GetShareableUsersSuccess
  | GetShareableUsersError
  | GetAutoSharedUsers
  | GetAutoSharedUsersSuccess
  | GetAutoSharedUsersError
  | RemoveAutoSharedUser
  | RemoveAutoSharedUserSuccess
  | RemoveAutoSharedUserError
  | OpenAutoShareModal
  | CloseAutoShareModal
  | SaveAutoShareUsers
  | SaveAutoShareUsersSuccess
  | SaveAutoShareUsersError
  | ToggleSelectedUser;
