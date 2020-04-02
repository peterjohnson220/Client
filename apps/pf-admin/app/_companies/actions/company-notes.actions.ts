import { Action } from '@ngrx/store';

import { CompanyNote } from 'libs/models/payfactors-api';

export const LOAD_COMPANY_NOTES = '[Pf-Admin/Company Page] Load Company Notes';
export const LOAD_COMPANY_NOTES_SUCCESS = '[Pf-Admin/Company Page] Load Company Notes Success';
export const LOAD_COMPANY_NOTES_ERROR = '[Pf-Admin/Company Page] Load Company Notes Error';

export const SAVE_COMPANY_NOTE = '[Pf-Admin/Company Page] Save Company Notes';
export const SAVE_COMPANY_NOTE_SUCCESS = '[Pf-Admin/Company Page] Save Company Notes Success';
export const SAVE_COMPANY_NOTE_ERROR = '[Pf-Admin/Company Page] Save Company Notes Error';

export const RESET_COMPANY_NOTE_STATE = '[Pf-Admin/Company Page] Reset Company Notes State';

export class ResetCompanyNotes implements Action {
    readonly type = RESET_COMPANY_NOTE_STATE;
}

export class LoadCompanyNotes implements Action {
    readonly type = LOAD_COMPANY_NOTES;

    constructor(public payload: {companyId: number}) {}
}

export class LoadCompanyNotesSuccess implements Action {
    readonly type = LOAD_COMPANY_NOTES_SUCCESS;

    constructor(public payload: CompanyNote[]) {}
}

export class LoadCompanyNotesError implements Action {
    readonly type = LOAD_COMPANY_NOTES_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class SaveCompanyNote implements Action {
    readonly type = SAVE_COMPANY_NOTE;

    constructor(public payload: {note: CompanyNote, actionType: string}) {}
}

export class SaveCompanyNoteSuccess implements Action {
    readonly type = SAVE_COMPANY_NOTE_SUCCESS;
}

export class SaveCompanyNoteError implements Action {
    readonly type = SAVE_COMPANY_NOTE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

  export type Actions
  = LoadCompanyNotes
  | LoadCompanyNotesSuccess
  | LoadCompanyNotesError
  | SaveCompanyNote
  | SaveCompanyNoteSuccess
  | SaveCompanyNoteError
  | ResetCompanyNotes;
