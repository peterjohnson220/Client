import { Action } from '@ngrx/store';

export const LOAD_ACCESS_PERMISSIONS = '[Peer Shared] Loading Access Permissions';
export const LOAD_ACCESS_PERMISSIONS_SUCCESS = '[Peer Shared] Loading Access Permissions Success';
export const LOAD_ACCESS_PERMISSIONS_ERROR = '[Peer Shared] Loading Access Permissions Error';

export class LoadAccessPermissions implements Action {
    readonly type = LOAD_ACCESS_PERMISSIONS;
}

export class LoadAccessPermissionsSuccess implements Action {
    readonly type = LOAD_ACCESS_PERMISSIONS_SUCCESS;

    constructor(public payload: number[]) { }
}

export class LoadAccessPermissionsError implements Action {
    readonly type = LOAD_ACCESS_PERMISSIONS_ERROR;
}

export type Actions
    = LoadAccessPermissions
    | LoadAccessPermissionsSuccess
    | LoadAccessPermissionsError;




