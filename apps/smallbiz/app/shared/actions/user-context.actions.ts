import { Action } from '@ngrx/store';
import { UserContext } from '../models/user-context.model';

export const SET_USER_CONTEXT = '[UserContext] Set';
export const CLEAR_USER_CONTEXT = '[UserContext] Clear';

export class Set implements Action {
    readonly type = SET_USER_CONTEXT;
    constructor(public payload: UserContext) {}
}

export class Clear implements Action {
    readonly type = CLEAR_USER_CONTEXT;
}

export type UserContextAction = Set | Clear;
