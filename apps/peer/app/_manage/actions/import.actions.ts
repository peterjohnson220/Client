import { Action } from '@ngrx/store';

export const SWITCH_ASSOCIATION_IMPORT_MODAL_OPEN = '[Peer Main/Exchange Request] Switch Association Import Modal';
export const GET_ASSOCIATION_IMPORT_MODAL = '[Peer Main/Exchange Request] Get Association Import Modal';
export const SWITCH_ASSOCIATION_IMPORT_STATUS = '[Peer Main/Exchange Request] Switch Associations Import Status';
export const GET_ASSOCIATION_IMPORT_STATUS = '[Peer Main/Exchange Request] Get Associations Import Status';

export class SwitchAssociationImportModalOpenAction implements Action {
    readonly type = SWITCH_ASSOCIATION_IMPORT_MODAL_OPEN;
    constructor(public payload: boolean) { }
}

export class SwitchAssociationImportStatus implements Action {
    readonly type = SWITCH_ASSOCIATION_IMPORT_STATUS;
    constructor(public payload: ImportStatusEnum) { }
}

export class GetAssociationImportModalAction implements Action {
    readonly type = GET_ASSOCIATION_IMPORT_MODAL;
}

export class GetAssociationImportStatus implements Action {
    readonly type = GET_ASSOCIATION_IMPORT_STATUS;
}

export type Actions =
    SwitchAssociationImportModalOpenAction |
    GetAssociationImportModalAction |
    SwitchAssociationImportStatus |
    GetAssociationImportStatus;

export enum ImportStatusEnum {
    Failed = -1,
    Idle = 0,
    Success = 1,
    InProcess = 2
}
