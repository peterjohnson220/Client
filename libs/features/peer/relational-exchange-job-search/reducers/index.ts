import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromRelationalExchangeJobSearchReducer from './relational-exchange-job-search.reducer';

// Page Module State
export interface RelationalExchangeJobSearchState {
  relationalExchangeJobSearch: fromRelationalExchangeJobSearchReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  libs_peer_relationalExchangeJobSearch: RelationalExchangeJobSearchState;
}

export const reducers = {
  relationalExchangeJobSearch: fromRelationalExchangeJobSearchReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<RelationalExchangeJobSearchState>('libs_peer_relationalExchangeJobSearch');

// Feature Selectors
export const selectExchangeJobSearchState = createSelector(
  selectFeatureAreaState,
  (state: RelationalExchangeJobSearchState) => state.relationalExchangeJobSearch
);

// Exchange Job Search Selectors
export const getExchangeId = createSelector(
  selectExchangeJobSearchState,
  fromRelationalExchangeJobSearchReducer.getExchangeId
)
export const getExchangeJobs = createSelector(
  selectExchangeJobSearchState,
  fromRelationalExchangeJobSearchReducer.getExchangeJobs
);

export const getNoResultsMessage = createSelector(
  selectExchangeJobSearchState,
  fromRelationalExchangeJobSearchReducer.getNoResultsMessage
);

export const getSelectedExchangeJobs = createSelector(
  selectExchangeJobSearchState,
  fromRelationalExchangeJobSearchReducer.getSelectedExchangeJobs
);

export const getSelectedExchangeJobsCount = createSelector(
  selectExchangeJobSearchState,
  fromRelationalExchangeJobSearchReducer.getSelectedExchangeJobsCount
);
