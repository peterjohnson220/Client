import { Action } from '@ngrx/store';

import { FooterViewModel } from '../models';

export const SAVE_FOOTER_VIEW = '[JobDescriptionSettings/Job Description Footer View] Save Job Description Footer View';
export const SAVE_FOOTER_VIEW_SUCCESS = '[JobDescriptionSettings/Job Description Footer View] Save Job Description Footer View Success';
export const SAVE_FOOTER_VIEW_ERROR = '[JobDescriptionSettings/Job Description Footer View] Save Job Description Footer View Error';
export const LOAD_FOOTER_VIEW = '[JobDescriptionSettings/Job Description Footer View] Load Job Description Footer View';
export const LOAD_FOOTER_VIEW_SUCCESS = '[JobDescriptionSettings/Job Description Footer View] Load Job Description Footer View Success';
export const LOAD_FOOTER_VIEW_ERROR = '[JobDescriptionSettings/Job Description Footer View] Load Job Description Footer View Error';


export class SaveFooterViewAction implements Action {
    readonly type = SAVE_FOOTER_VIEW;
    constructor(public payload: FooterViewModel) {}
}

export class SaveFooterViewActionSuccess implements Action {
    readonly type = SAVE_FOOTER_VIEW_SUCCESS;
    constructor(public payload: FooterViewModel) {}
}

export class SaveFooterViewActionError implements Action {
    readonly type = SAVE_FOOTER_VIEW_ERROR;
}

export class LoadFooterViewAction implements Action {
    readonly type = LOAD_FOOTER_VIEW;
}

export class LoadFooterViewActionSuccess implements Action {
    readonly type = LOAD_FOOTER_VIEW_SUCCESS;
    constructor(public payload: FooterViewModel) {}
}

export class LoadFooterViewActionError implements Action {
    readonly type = LOAD_FOOTER_VIEW_ERROR;
}

export type Actions
= SaveFooterViewAction
| SaveFooterViewActionSuccess
| SaveFooterViewActionError
| LoadFooterViewAction
| LoadFooterViewActionSuccess
| LoadFooterViewActionError;
