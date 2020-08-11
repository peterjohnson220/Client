import { Action } from '@ngrx/store';

import { AddNoteRequest, NotesBase, AddNoteRequestResponseBase } from '../../../models/notes';

export const RESET_STATE = '[Notes Manager] Reset State';
export const GET_NOTES = '[Notes Manager] Get Notes';
export const GET_NOTES_SUCCESS = '[Notes Manager] Get Notes Success';
export const GET_NOTES_ERROR = '[Notes Manager] Get Notes Error';
export const ADD_NOTE = '[Notes Manager] Add Note';
export const ADD_NOTE_SUCCESS = '[Notes Manager] Add Note Success';
export const ADD_NOTE_ERROR = '[Notes Manager] Add Note Error';

export class ResetState implements Action {
  readonly type = RESET_STATE;
  constructor() { }
}

export class GetNotes implements Action {
  readonly type = GET_NOTES;
  constructor(public payload: AddNoteRequestResponseBase) { }
}

export class GetNotesSuccess implements Action {
  readonly type = GET_NOTES_SUCCESS;
  constructor(public payload: NotesBase[]) { }
}

export class GetNotesError implements Action {
  readonly type = GET_NOTES_ERROR;
  constructor() { }
}

export class AddNote implements Action {
  readonly type = ADD_NOTE;
  constructor(public payload: AddNoteRequest) { }
}

export class AddNoteSuccess implements Action {
  readonly type = ADD_NOTE_SUCCESS;
  constructor(public payload: AddNoteRequestResponseBase) { }
}

export class AddNoteError implements Action {
  readonly type = ADD_NOTE_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = ResetState
  | GetNotes
  | GetNotesSuccess
  | GetNotesError
  | AddNote
  | AddNoteSuccess
  | AddNoteError;
