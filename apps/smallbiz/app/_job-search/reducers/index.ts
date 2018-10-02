import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from '../../shared/state';

// Import feature reducers
import * as fromJobSearchReducer from './job-search.reducers';

// Feature area state
export interface JobSearchAreaState {
    jobSearch: fromJobSearchReducer.State;
}

// Extend root state with feature state
export interface State extends fromRoot.AppState {
    jobSearchArea: JobSearchAreaState;
}

export const reducers: ActionReducerMap<JobSearchAreaState> = {
    jobSearch: fromJobSearchReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobSearchAreaState>('jobSearchArea');

export const selectJobSearchState = createSelector(selectFeatureAreaState, (jobSearchArea: JobSearchAreaState) => jobSearchArea.jobSearch);
export const selectIsSearching = createSelector(selectJobSearchState, fromJobSearchReducer.getIsSearching);
export const selectSearchSuccess = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchSuccess);
export const selectSearchFailure = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchFailure);
export const selectSearchResults = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchResults);
