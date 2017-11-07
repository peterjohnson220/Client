import { Action } from '@ngrx/store';

export const GET_IDENTITY = '[AppContext/Identity] Get Identity';
export const GET_IDENTITY_SUCCESS = '[AppContext/Identity] Get Identity Success';
export const GET_IDENTITY_ERROR = '[AppContext/Identity] Get Identity Error';

export class GetIdentity implements Action {
  readonly type = GET_IDENTITY;

  constructor() {}
}

export class GetIdentitySuccess implements Action {
  readonly type = GET_IDENTITY_SUCCESS;

  // TODO: Update this to be an identity model
  constructor(public payload: any) {}
}

export class GetIdentityError implements Action {
  readonly type = GET_IDENTITY_ERROR;

  constructor() {}
}

export type Actions =
  | GetIdentity
  | GetIdentitySuccess
  | GetIdentityError;
