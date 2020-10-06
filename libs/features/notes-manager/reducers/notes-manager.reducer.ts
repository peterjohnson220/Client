import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, UserContext } from 'libs/models';
import { NotesBase } from 'libs/models/notes';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromNotesManagerActions from '../actions';
import { ApiServiceType } from '../constants/api-service-type-constants';
import { NoteOperation } from '../constants/note-operation-constants';

export interface State {
  notes: AsyncStateObj<NotesBase[]>;
  apiService: ApiServiceType;
}

export const initialState: State = {
  notes: generateDefaultAsyncStateObj<NotesBase[]>([]),
  apiService: null,
};

export function reducer(state = initialState, action: fromNotesManagerActions.Actions): State {
  switch (action.type) {
    case fromNotesManagerActions.RESET_STATE:
      return initialState;
    case fromNotesManagerActions.CLEAR_NOTES:
      return {
        ...state,
        notes: generateDefaultAsyncStateObj<NotesBase[]>([])
      };
    case fromNotesManagerActions.LOAD_API_SERVICE:
      return {
        ...state,
        apiService: action.payload
      };
    case fromNotesManagerActions.GET_NOTES:
      return AsyncStateObjHelper.loading(state, 'notes');
    case fromNotesManagerActions.GET_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'notes', action.payload);
    case fromNotesManagerActions.GET_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'notes', action.payload);
    case fromNotesManagerActions.ADD_NOTE:
      return addNote(state, action.noteText, action.userContext);
    case fromNotesManagerActions.EDIT_NOTE:
      return editNote(state, action.oldNote, action.noteText);
    case fromNotesManagerActions.DELETE_NOTE:
      return deleteNote(state, action.payload);
    case fromNotesManagerActions.SAVE_NOTES:
      return AsyncStateObjHelper.saving(state, 'notes');
    case fromNotesManagerActions.SAVE_NOTES_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'notes');
    case fromNotesManagerActions.SAVE_NOTES_ERROR:
      return AsyncStateObjHelper.savingError(state, 'notes', action.payload);
    default:
      return state;
  }
}

export function addNote(state: State, noteText: string, userContext: UserContext) {
  const newNote: NotesBase = {
    Id: null,
    Notes: noteText,
    UserId: userContext.UserId,
    FirstName: userContext.FirstName,
    LastName: userContext.LastName,
    UserPicture: userContext.UserPicture,
    CreateDate: new Date(Date.now()).toString(),
    NoteOperation: NoteOperation.Add
  };

  const updatedNotes = cloneDeep(state.notes.obj);
  updatedNotes.unshift(newNote);

  return updateNotes(state, updatedNotes);
}

export function editNote(state: State, oldNote: NotesBase, noteText: string) {

  const noteToUpdateIndex = state.notes.obj.findIndex(element => element === oldNote);
  const updatedNotes: NotesBase[] = cloneDeep(state.notes.obj);
  const noteToUpdate = updatedNotes[noteToUpdateIndex];
  noteToUpdate.Notes = noteText;
  noteToUpdate.NoteOperation = NoteOperation.Add ? NoteOperation.Add : NoteOperation.Edit;

  return updateNotes(state, updatedNotes);
}

export function deleteNote(state: State, noteToDelete: NotesBase): State {
  const updatedNotes: NotesBase[] = cloneDeep(state.notes.obj);
  const noteToUpdateIndex = state.notes.obj.findIndex(element => element === noteToDelete);

  if (noteToDelete.NoteOperation === NoteOperation.Add) {
    updatedNotes.splice(noteToUpdateIndex, 1);
  } else {
    updatedNotes[noteToUpdateIndex].NoteOperation = NoteOperation.Delete;
  }

  return updateNotes(state, updatedNotes);
}

export function updateNotes(state: State, notes: NotesBase[]) {
  return {
    ...state,
    notes: {
      ...state.notes,
      obj: notes
    }
  };
}

export const getState = (state: State) => state;
export const getNotes = (state: State) => state.notes;
export const getApiService = (state: State) => state.apiService;
