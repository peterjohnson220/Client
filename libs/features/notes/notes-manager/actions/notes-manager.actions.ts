import { Action } from '@ngrx/store';
import { UserContext } from 'libs/models';

import { NotesBase } from '../../../../models/notes';
import { ApiServiceType } from '../constants/api-service-type-constants';

export const RESET_STATE = '[Notes Manager] Reset State';
export const CLEAR_NOTES = '[Notes Manager] Clear Notes';
export const LOAD_API_SERVICE = '[Notes Manager] Load Api Service';
export const GET_NOTES = '[Notes Manager] Get Notes';
export const GET_NOTES_SUCCESS = '[Notes Manager] Get Notes Success';
export const GET_NOTES_ERROR = '[Notes Manager] Get Notes Error';
export const ADD_NOTE = '[Notes Manager] Add Note';
export const EDIT_NOTE = '[Notes Manager] Edit Note';
export const DELETE_NOTE = '[Notes Manager] Delete Note';
export const SAVE_NOTES = '[Notes Manager] Save Notes';
export const SAVE_NOTES_SUCCESS = '[Notes Manager] Save Notes Success';
export const SAVE_NOTES_ERROR = '[Notes Manager] Save Notes Error';

export class ResetState implements Action {
  readonly type = RESET_STATE;
  constructor() { }
}

export class ClearNotes implements Action {
  readonly type = CLEAR_NOTES;
  constructor() { }
}

export class LoadApiService implements Action {
  readonly type = LOAD_API_SERVICE;
  constructor(public payload: ApiServiceType) { }
}

export class GetNotes implements Action {
  readonly type = GET_NOTES;
  constructor(public payload: number) { }
}

export class GetNotesSuccess implements Action {
  readonly type = GET_NOTES_SUCCESS;
  constructor(public payload: NotesBase[]) { }
}

export class GetNotesError implements Action {
  readonly type = GET_NOTES_ERROR;
  constructor(public payload: any) { }
}

export class AddNote implements Action {
  readonly type = ADD_NOTE;
  constructor(public noteText: string, public userContext: UserContext) { }
}

export class DeleteNote implements Action {
  readonly type = DELETE_NOTE;
  constructor(public payload: NotesBase) {
  }
}

export class EditNote implements Action {
  readonly type = EDIT_NOTE;
  constructor(public oldNote, public noteText: string) {}
}

export class SaveNotes implements Action {
  readonly type = SAVE_NOTES;
  constructor(public entityId: number, public apiService: ApiServiceType = null) { }
}

export class SaveNotesSuccess implements Action {
  readonly type = SAVE_NOTES_SUCCESS;
  constructor(public apiServiceType: ApiServiceType) { }
}

export class SaveNotesError implements Action {
  readonly type = SAVE_NOTES_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = ResetState
  | ClearNotes
  | LoadApiService
  | GetNotes
  | GetNotesSuccess
  | GetNotesError
  | AddNote
  | DeleteNote
  | EditNote
  | SaveNotes
  | SaveNotesSuccess
  | SaveNotesError;
