// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as companyNotesReducer from './company-notes.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCompanyNotesReducer from './company-notes.reducer';


// Feature area state
export interface CompanyNotesModalFeatureState {
  companyNotes: companyNotesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_CompanyNotesModalFeature: CompanyNotesModalFeatureState;
}

// Feature area reducers
export const reducers = {
  companyNotes: companyNotesReducer.reducer
};

// Select Feature Area
export const selectFeatureState = createFeatureSelector<CompanyNotesModalFeatureState>('feature_CompanyNotesModalFeature');

// Feature Selectors
export const selectCompanyNotesState = createSelector(
  selectFeatureState,
  (state: CompanyNotesModalFeatureState) => state.companyNotes
);

// Selectors
export const getNotes = createSelector(selectCompanyNotesState, companyNotesReducer.getNotes);

export const getCompanyNotes =
  createSelector( selectCompanyNotesState, fromCompanyNotesReducer.getNotes);
