import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { NotesBase } from 'libs/models/notes';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromNotesManagerActions from '../actions';

export interface State {
  notes: AsyncStateObj<NotesBase[]>;
  addingNote: AsyncStateObj<boolean>;
}

export const initialState: State = {
  notes: generateDefaultAsyncStateObj<NotesBase[]>([]),
  addingNote: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromNotesManagerActions.Actions): State {
  switch (action.type) {
    case fromNotesManagerActions.RESET_STATE:
      return initialState;
    case fromNotesManagerActions.GET_NOTES:
      return AsyncStateObjHelper.loading(state, 'notes');
    case fromNotesManagerActions.GET_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'notes', action.payload);
    case fromNotesManagerActions.GET_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'notes');
    case fromNotesManagerActions.ADD_NOTE:
      return AsyncStateObjHelper.saving(state, 'addingNote');
    case fromNotesManagerActions.ADD_NOTE_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'addingNote');
    case fromNotesManagerActions.ADD_NOTE_ERROR:
      return AsyncStateObjHelper.savingError(state, 'addingNote', action.payload);
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.notes.loading;
export const getNotes = (state: State) => state.notes;
export const getAddingNote = (state: State) => state.addingNote;
