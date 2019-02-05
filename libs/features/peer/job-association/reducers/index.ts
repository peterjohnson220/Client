import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

// Import feature reducers
import * as fromCompanyJobsReducer from './company-jobs.reducer';
import * as fromExchangeJobsReducer from './exchange-jobs.reducer';


// Feature area state
export interface JobAssociationFeatureState {
  companyJobs: IFeatureGridState<fromCompanyJobsReducer.State>;
  exchangeJobs: IFeatureGridState<fromExchangeJobsReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_job_association: JobAssociationFeatureState;
}

// Feature area reducers
export const reducers = {
  companyJobs: fromCompanyJobsReducer.reducer,
  exchangeJobs: fromExchangeJobsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobAssociationFeatureState>('feature_job_association');

// Feature Selectors
export const selectExchangeJobsState = createSelector(
  selectFeatureAreaState,
  (state: JobAssociationFeatureState) => state.exchangeJobs
);

export const selectCompanyJobsState = createSelector(
  selectFeatureAreaState,
  (state: JobAssociationFeatureState) => state.companyJobs);

// Exchange Jobs Selectors
export const getExchangeJobsGridState = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.grid);

export const getExchangeJobsFeature = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.feature);

export const {
  selectAll: getExchangeJobsList
} = fromExchangeJobsReducer.adapter.getSelectors(getExchangeJobsFeature);

export const getExchangeJobsTotal = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getTotal
);

export const getExchangeJobsData = createSelector(
  getExchangeJobsList,
  getExchangeJobsTotal,
  (data, total) => ({ data, total })
);

// Company Jobs Selectors
export const getCompanyJobsGrid = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.grid);

export const getCompanyJobsGridState = createSelector(
  getCompanyJobsGrid,
  (fromGridReducer.getGridState)
);

export const getCompanyJobsFeature = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.feature);

export const {
  selectAll: getCompanyJobsList
} = fromCompanyJobsReducer.adapter.getSelectors(getCompanyJobsFeature);

export const getCompanyJobsTotal = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getTotal);

export const getCompanyJobsData = createSelector(
  getCompanyJobsList,
  getCompanyJobsTotal,
  (data, total) => ({ data, total})
);
export const getCompanyJobsLoading = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.loading
);

export const getCompanyJobsLoadingError = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.loadingError
);
