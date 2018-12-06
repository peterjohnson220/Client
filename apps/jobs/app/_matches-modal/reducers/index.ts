import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanyJobReducer from './company-job.reducer';
import * as fromMatchesReducer from './matches.reducer';


// Feature area state
export interface MatchesModalState {
  companyJob: fromCompanyJobReducer.State;
  matches: fromMatchesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  matchesModal: MatchesModalState;
}

// Feature area reducers
export const reducers = {
  companyJob: fromCompanyJobReducer.reducer,
  matches: fromMatchesReducer.reducer
};

// Select Feature Area
export const selectMatchesModalState = createFeatureSelector<MatchesModalState>('matchesModalArea');

// Feature Selectors
export const selectCompanyJobState = createSelector(selectMatchesModalState, (state: MatchesModalState) => state.companyJob);
export const selectMatchesState = createSelector(selectMatchesModalState, (state: MatchesModalState) => state.matches);


export const getCompanyJob = createSelector(selectCompanyJobState, fromCompanyJobReducer.getCompanyJob);
export const getCompanyJobLoading = createSelector(selectCompanyJobState, fromCompanyJobReducer.getLoading);
export const getCompanyJobLoadingError = createSelector(selectCompanyJobState, fromCompanyJobReducer.getLoadingError);

export const {
  selectAll: getMatches
} = fromMatchesReducer.adapter.getSelectors(selectMatchesState);
export const getMatchesLoading = createSelector(selectMatchesState, fromMatchesReducer.getLoading);
export const getMatchesLoadingError = createSelector(selectMatchesState, fromMatchesReducer.getLoadingError);
