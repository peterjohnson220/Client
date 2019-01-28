import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';
import * as fromComphubPageReducer from './comphub-page.reducer';
import * as fromMarketsPageReducer from './markets-page.reducer';

// Feature area state
export interface ComphubMainState {
  jobsPage: fromJobsPageReducer.State;
  comphubPage: fromComphubPageReducer.State;
  marketsPage: fromMarketsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_main: ComphubMainState;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer,
  comphubPage: fromComphubPageReducer.reducer,
  marketsPage: fromMarketsPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubMainState>('comphub_main');

// Feature Selectors
export const selectJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.jobsPage
);

export const selectComphubPageState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.comphubPage
);

export const selectMarketsPageState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.marketsPage
);

// Jobs Page
export const getTrendingJobGroups = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getTrendingJobGroups
);

export const getLoadingTrendingJobs = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingTrendingJobs
);

export const getLoadingTrendingJobsError = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingTrendingJobsError
);

export const getJobSearchOptions = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getJobSearchOptions
);

export const getLoadingJobSearchOptions = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingJobSearchOptions
);

export const getLoadingJobSearchOptionsError = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingJobSearchOptionsError
);

export const getSelectedJob = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getSelectedJob
);

// Comphub Page
export const getSelectedPageIndex = createSelector(
  selectComphubPageState,
  fromComphubPageReducer.getSelectedPageIndex
);

// Markets Page

export const getSelectedPaymarket = createSelector(
  selectMarketsPageState,
  fromMarketsPageReducer.getSelectedPaymarket
);

export const getLoadingPaymarkets = createSelector(
  selectMarketsPageState,
  fromMarketsPageReducer.getLoadingPaymarkets
);

export const getLoadingPaymarketsError = createSelector(
  selectMarketsPageState,
  fromMarketsPageReducer.getLoadingPaymarketsError
);

export const getPaymarkets = createSelector(
  selectMarketsPageState,
  fromMarketsPageReducer.getPaymarkets
);

export const getPaymarketsFilter = createSelector(
  selectMarketsPageState,
  fromMarketsPageReducer.getPaymarketsFilter
);

export const getVisiblePaymarkets = createSelector(
  getPaymarkets, getPaymarketsFilter, (paymarkets, filter) => {
    return paymarkets.filter(x => !filter || x.PayMarketName.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
);
