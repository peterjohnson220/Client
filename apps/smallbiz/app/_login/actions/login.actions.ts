import { Action } from '@ngrx/store';

export const LOGIN = '[Login] Login';
export const LOGIN_SUCCESS = '[Login] LoginSuccess';
export const LOGIN_FAILURE = '[Login] LoginFailure';

export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: { emailAddress: string, password: string }) {}
}

export class LoginSuccess implements Action {
    readonly type = LOGIN_SUCCESS;
    constructor(public payload: { emailAddress: string, name: string }) {}
}

export class LoginFailure implements Action {
    readonly type = LOGIN_FAILURE;
    constructor(public error: any) {}
}

export type LoginAction = Login | LoginSuccess | LoginFailure;
