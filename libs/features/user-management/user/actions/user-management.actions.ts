import { Action } from '@ngrx/store';
import { UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';

export const LOAD_ROLES = '[UserManagement] Load Roles';
export const LOAD_ROLES_SUCCESS = '[UserManagement] Load Roles Success';
export const LOAD_USER = '[UserManagement] Load User';
export const LOAD_USER_SUCCESS = '[UserManagement] Load User Success';
export const RESET_USER = '[UserManagement] Reset User';
export const SAVE_USER = '[UserManagement] Save User';
export const SAVE_USER_SUCCESS = '[UserManagement] Save User Success';
export const HANDLE_API_ERROR = '[UserManagement] Handle API Error';

export class LoadRoles implements Action {
    readonly type = LOAD_ROLES;
    constructor(public companyId: number) { }
}

export class LoadRolesSuccess implements Action {
    readonly type = LOAD_ROLES_SUCCESS;
    constructor(public payload: UserAssignedRole[]) { }
}

export class LoadUser implements Action {
    readonly type = LOAD_USER;
    constructor(public userId: number) { }
}

export class LoadUserSuccess implements Action {
    readonly type = LOAD_USER_SUCCESS;
    constructor(public payload: UserManagementDto) { }
}

export class ResetUser implements Action {
    readonly type = RESET_USER;
    constructor() { }
}

export class SaveUser implements Action {
    readonly type = SAVE_USER;
    constructor(public user: UserManagementDto) { }
}

export class SaveUserSuccess implements Action {
    readonly type = SAVE_USER_SUCCESS;
    constructor() { }
}

export class HandleApiError implements Action {
    readonly type = HANDLE_API_ERROR;
    constructor(public payload: string) { }
}

export type UserManagementActions =
    | LoadRoles
    | LoadRolesSuccess
    | LoadUser
    | LoadUserSuccess
    | ResetUser
    | SaveUser
    | SaveUserSuccess
    | HandleApiError;
