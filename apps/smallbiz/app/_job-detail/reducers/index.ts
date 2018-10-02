import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from '../../shared/state';

// Import feature reducers
import * as fromJobDetailReducer from './job-detail.reducer';

// Feature area state
export interface JobDetailAreaState {
    jobDetail: fromJobDetailReducer.State;
}

// Extend root state with feature state
export interface State extends fromRoot.AppState {
    jobDetailArea: JobDetailAreaState;
}

export const reducers: ActionReducerMap<JobDetailAreaState> = {
    jobDetail: fromJobDetailReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobDetailAreaState>('jobDetailArea');

export const selectJobLoadState = createSelector(selectFeatureAreaState, (jobDetailArea: JobDetailAreaState) => jobDetailArea.jobDetail);
export const selectIsLoading = createSelector(selectJobLoadState, fromJobDetailReducer.getIsLoading);
export const selectLoadSuccess = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadSuccess);
export const selectLoadFailure = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadFailure);
export const selectJob = createSelector(selectJobLoadState, fromJobDetailReducer.getJob);
