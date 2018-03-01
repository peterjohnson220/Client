import { Action } from '@ngrx/store';

import { UserContext } from '../../../models';

export const GET_USER_CONTEXT = '[AppContext/User Context] Get User Context';
export const GET_USER_CONTEXT_SUCCESS = '[AppContext/User Context] Get User Context Success';
export const GET_USER_CONTEXT_ERROR = '[AppContext/User Context] Get User Context Error';
export const GET_USER_CONTEXT_401_ERROR = '[AppContext/User Context] Get User Context 401 Error';

export class GetUserContext implements Action {
  readonly type = GET_USER_CONTEXT;

  constructor() {
  }
}

export class GetUserContextSuccess implements Action {
  readonly type = GET_USER_CONTEXT_SUCCESS;

  constructor(public payload: UserContext) {
  }
}

export class GetUserContextError implements Action {
  readonly type = GET_USER_CONTEXT_ERROR;

  constructor(public error: any) {
  }
}

export class GetUserContext401Error implements Action {
  readonly type = GET_USER_CONTEXT_401_ERROR;

  constructor() {
  }
}


export type Actions =
  | GetUserContext
  | GetUserContextSuccess
  | GetUserContextError
  | GetUserContext401Error;
