import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { NotesBase } from 'libs/models/notes';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromNotesManagerActions from '../actions';
import { ApiServiceType } from '../constants/api-service-type-constants';
import { NoteOperation } from '../constants/note-operation-constants';

export interface State {
  notes: AsyncStateObj<NotesBase[]>;
  savingNotes: AsyncStateObj<boolean>;
  apiServiceIndicator: ApiServiceType;
  currentUserId: number;
}

export const initialState: State = {
  notes: generateDefaultAsyncStateObj<NotesBase[]>([]),
  savingNotes: generateDefaultAsyncStateObj<boolean>(false),
  apiServiceIndicator: null,
  currentUserId: -1
};

export function reducer(state = initialState, action: fromNotesManagerActions.Actions): State {
  switch (action.type) {
    case fromNotesManagerActions.RESET_STATE:
      return initialState;
    case fromNotesManagerActions.CLEAR_NOTES:
      return {...initialState, currentUserId: state.currentUserId, apiServiceIndicator: state.apiServiceIndicator };
    case fromNotesManagerActions.LOAD_API_SERVICE:
      return loadStateProperty(state, 'apiServiceIndicator', action.payload);
    case fromNotesManagerActions.LOAD_USER_ID:
      return loadStateProperty(state, 'currentUserId', action.payload);
    case fromNotesManagerActions.GET_NOTES:
      return AsyncStateObjHelper.loading(state, 'notes');
    case fromNotesManagerActions.GET_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'notes', action.payload);
    case fromNotesManagerActions.GET_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'notes', action.payload);
    case fromNotesManagerActions.ADD_NOTE:
      return addNote(state, 'notes', action.payload);
    case fromNotesManagerActions.DELETE_NOTE:
      return determineDeleteType(state, 'notes', action.payload); // action.payload is a single note
    case fromNotesManagerActions.EDIT_NOTE:
      return inplaceStateEdit(state, 'notes', editHelper(state, action.payload));
    case fromNotesManagerActions.SAVE_NOTES:
      return AsyncStateObjHelper.saving(state, 'savingNotes');
    case fromNotesManagerActions.SAVE_NOTES_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'savingNotes');
    case fromNotesManagerActions.SAVE_NOTES_ERROR:
      return AsyncStateObjHelper.savingError(state, 'savingNotes', action.payload);
    default:
      return state;
  }
}

export function determineDeleteType(state: State, propertyName: string, note: NotesBase): State {
  if (note.NoteOperation === NoteOperation.Add) {
    return removeStateElement(state, propertyName, note);
  } else {
    const noteMarkedForDelete: NotesBase = {...note, NoteOperation: NoteOperation.Delete};
    return inplaceStateEdit(state, propertyName, {OldObj: note, NewObj: noteMarkedForDelete});
  }
}

export function editHelper(state: State, payload) {
  const updatedNote: NotesBase = {...payload.OldObj, Notes: payload.ReplacementStr, EditUser: state.currentUserId,
    NoteOperation: payload.OldObj.NoteOperation === NoteOperation.Add ? NoteOperation.Add : NoteOperation.Edit};

  return { OldObj: payload.OldObj, NewObj: updatedNote };
}

export function inplaceStateEdit(state, propertyName: string, payload?: any) {
  let updatedObjList: any[] = [];
  const isArray = Array.isArray(state[propertyName].obj);

  if (isArray) {
    const oldObjIndex = state[propertyName].obj.findIndex(element => element === payload.OldObj);
    updatedObjList = cloneDeep(state[propertyName].obj);
    updatedObjList[oldObjIndex] = cloneDeep(payload.NewObj);
  }

  return {
    ...state,
    [propertyName]: { ...state[propertyName], obj: isArray ? updatedObjList : payload.NewObj }
  };
}

export function removeStateElement(state, propertyName: string, payload: any) {
  let updatedObjList: any;
  const isArray = Array.isArray(state[propertyName].obj);

  if (isArray) {
    updatedObjList = state[propertyName].obj.filter(element => element !== payload);
  }

  return {
    ...state,
    [propertyName]: { ...state[propertyName], obj: isArray ? updatedObjList : null }
  };
}

export function loadStateProperty(state, propertyName: string, payload?: any) {
  return {
    ...state,
    [propertyName]: payload
  };
}

export function addNote(state, propertyName: string, payload?: any) {
  const tempNote: NotesBase = {
    Id: null,
    Notes : payload.noteText,
    UserId : state.currentUserId,
    FirstName : payload.userFirstName,
    LastName : payload.userLastName,
    UserPicture : payload.userPhoto,
    CreateDate: new Date(Date.now()).toString(),
    NoteOperation: NoteOperation.Add
  };

  const notesToDisplay = state[propertyName].obj.concat(tempNote).sort((a: NotesBase, b: NotesBase) => {
    return new Date(b.CreateDate).getTime() - new Date(a.CreateDate).getTime();
  });

  return {
    ...state,
    [propertyName]: { ...state[propertyName], loading: false, obj: notesToDisplay}
  };
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.notes.loading;
export const getNotes = (state: State) => state.notes;
export const getSavingNotes = (state: State) => state.savingNotes;
export const getApiServiceIndicator = (state: State) => state.apiServiceIndicator;
export const getUserId = (state: State) => state.currentUserId;
