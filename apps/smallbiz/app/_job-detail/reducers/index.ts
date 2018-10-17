import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from '../../shared/state';

// Import feature reducers
import * as fromJobDetailReducer from './job-detail.reducer';
import * as fromPriceJobReducer from './price-job.reducer';

// Feature area state
export interface JobDetailAreaState {
    jobDetail: fromJobDetailReducer.State;
    priceJob: fromPriceJobReducer.State;
}

// Extend root state with feature state
export interface State extends fromRoot.AppState {
    jobDetailArea: JobDetailAreaState;
}

export const reducers: ActionReducerMap<JobDetailAreaState> = {
    jobDetail: fromJobDetailReducer.reducer,
    priceJob: fromPriceJobReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobDetailAreaState>('jobDetailArea');

// job
export const selectJobLoadState = createSelector(selectFeatureAreaState, (jobDetailArea: JobDetailAreaState) => jobDetailArea.jobDetail);
export const selectIsLoading = createSelector(selectJobLoadState, fromJobDetailReducer.getIsLoading);
export const selectLoadSuccess = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadSuccess);
export const selectLoadFailure = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadFailure);
export const selectJob = createSelector(selectJobLoadState, fromJobDetailReducer.getJob);

// price job
export const selectPriceJobState = createSelector(selectFeatureAreaState, (jobDetailArea: JobDetailAreaState) => jobDetailArea.priceJob);
export const selectIsSearchingLocation = createSelector(selectPriceJobState, fromPriceJobReducer.getIsSearchingLocation);
export const selectLocationSearchTerm = createSelector(selectPriceJobState, fromPriceJobReducer.getLocationSearchTerm);
export const selectSelectedLocation = createSelector(selectPriceJobState, fromPriceJobReducer.getSelectedLocation);
export const selectLocationResults = createSelector(selectPriceJobState, fromPriceJobReducer.getLocationResults);
