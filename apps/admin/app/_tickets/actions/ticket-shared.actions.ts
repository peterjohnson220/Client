import { Action } from '@ngrx/store';

export const USER_DETAIL_MODAL_OPEN = '[Admin Tickets] User Detail Modal Open';
export const GET_USER_DETAIL = '[Admin Tickets] Get User Detail';
export const GET_USER_DETAIL_SUCCESS = '[Admin Tickets] Get User Detail Success';
export const GET_USER_DETAIL_FAILED = '[Admin Tickets] Get User Detail Failed';

export class UserDetailOpen implements Action {
    readonly type = USER_DETAIL_MODAL_OPEN;

    constructor(public payload: boolean) { }
}

export class GetUserDetail implements Action {
    readonly type = GET_USER_DETAIL;

    constructor(public userid: number, public ticketId: number) { }
}

export class GetUserDetailSuccess implements Action {
    readonly type = GET_USER_DETAIL_SUCCESS;

    constructor(public userdetails: any, public ticketId: number) { }
}

export class GetUserDetailFailed implements Action {
    readonly type = GET_USER_DETAIL_FAILED;
}

export type Actions =
    UserDetailOpen
    | GetUserDetail
    | GetUserDetailSuccess
    | GetUserDetailFailed;
