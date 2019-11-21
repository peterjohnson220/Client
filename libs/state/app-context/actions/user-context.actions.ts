import { Action } from '@ngrx/store';

import { UserContext, UserContextError } from '../../../models';

export const GET_USER_CONTEXT = '[AppContext/User Context] Get User Context';
export const GET_USER_CONTEXT_SUCCESS = '[AppContext/User Context] Get User Context Success';
export const GET_USER_CONTEXT_ERROR = '[AppContext/User Context] Get User Context Error';
export const GET_USER_CONTEXT_401_ERROR = '[AppContext/User Context] Get User Context 401 Error';
export const GET_USER_CONTEXT_403_ERROR = '[AppContext/User Context] Get User Context 403 Error';
export const GET_USER_CONTEXT_404_ERROR = '[AppContext/User Context] Get User Context 404 Error';

export class GetUserContext implements Action {
  readonly type = GET_USER_CONTEXT;
  constructor() { }
}

export class GetUserContextSuccess implements Action {
  readonly type = GET_USER_CONTEXT_SUCCESS;
  constructor(public payload: UserContext) { }
}

export class GetUserContextError implements Action {
  readonly type = GET_USER_CONTEXT_ERROR;
  constructor(public errorContext: UserContextError) { }
}

export class GetUserContext401Error implements Action {
  readonly type = GET_USER_CONTEXT_401_ERROR;
  constructor(public redirect: string) { }
}

export class GetUserContext403Error implements Action {
  readonly type = GET_USER_CONTEXT_403_ERROR;
  constructor(public payload: {errorMessage: string}) { }
}

export class GetUserContext404Error implements Action {
  readonly type = GET_USER_CONTEXT_404_ERROR;
  constructor() { }
}


export type Actions =
  | GetUserContext
  | GetUserContextSuccess
  | GetUserContextError
  | GetUserContext401Error
  | GetUserContext403Error
  | GetUserContext404Error;
