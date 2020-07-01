import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromNotesManagerReducer from './notes-manager.reducer';

// Feature area state
export interface NotesManagerState {
  notesManager: fromNotesManagerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_notes_manager: NotesManagerState;
}

// Feature area reducers
export const reducers = {
  notesManager: fromNotesManagerReducer.reducer
};

// Select Feature Area
export const selectNotesManagerFeature =
  createFeatureSelector<NotesManagerState>('feature_notes_manager');

// View Selectors
export const selectNotesManagerState =
  createSelector(selectNotesManagerFeature, (state: NotesManagerState) => state.notesManager);

// Notes
export const getState = createSelector(selectNotesManagerState, fromNotesManagerReducer.getState);
export const getLoading = createSelector(selectNotesManagerState, fromNotesManagerReducer.getLoading);
export const getNotes = createSelector(selectNotesManagerState, fromNotesManagerReducer.getNotes);
export const getAddingNote = createSelector(selectNotesManagerState, fromNotesManagerReducer.getAddingNote);

