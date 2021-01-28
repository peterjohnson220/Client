import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddJobsPageReducer from './add-jobs-page.reducer';
import * as fromPaymarketsReducer from './paymarkets.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';

// Feature area state
export interface AddJobsState {
  addJobsPage: fromAddJobsPageReducer.State;
  paymarkets: fromPaymarketsReducer.State;
  searchResults: fromSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  addJobsPage: fromAddJobsPageReducer.reducer,
  paymarkets: fromPaymarketsReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('addJobs_reducers');

// Feature Selectors
export const selectAddJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.addJobsPage
);

export const selectPaymarketsState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.paymarkets
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.searchResults
);

// Add Jobs Page Selectors
export const getContext = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getContext
);

export const getContextStructureRangeGroupId = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getContextStructureRangeGroupId
);

export const getAddingData = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingData
);

export const getAddingDataError = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingDataError
);

export const getAddingDataErrorMessage = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingDataErrorMessage
);

// Paymarkets Selectors
export const getPaymarkets = createSelector(
  selectPaymarketsState,
  fromPaymarketsReducer.getPaymarkets
);

export const getSelectedPaymarkets = createSelector(
  getPaymarkets, paymarkets => {
    return paymarkets.filter(x => x.IsSelected).map(p => p.CompanyPayMarketId);
  }
);

export const getVisiblePaymarkets = createSelector(
  getPaymarkets, paymarkets => {
    return paymarkets.filter(x => !x.IsHidden);
  }
);

export const getDefaultPaymarket = createSelector(
  selectPaymarketsState,
  fromPaymarketsReducer.getDefaultPaymarket
);

export const getLoadingPaymarkets = createSelector(
  selectPaymarketsState,
  fromPaymarketsReducer.getLoadingPaymarkets
);

export const getLoadingPaymarketsError = createSelector(
  selectPaymarketsState,
  fromPaymarketsReducer.getLoadingPaymarketsError
);
export const getSearchTerm = createSelector(
  selectPaymarketsState,
  fromPaymarketsReducer.getSearchTerm
);

// Search Results Selectors
export const getJobs = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getJobs
);

export const getSelectedJobIds = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedJobIds
);

export const getSelectedPayfactorsJobCodes = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedPayfactorsJobCodes
);
