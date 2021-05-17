import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromExchangeJobSearchReducer from './exchange-job-search.reducer';

// Page Module State
export interface ExchangeJobSearchState {
  exchangeJobSearch: fromExchangeJobSearchReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  libs_peer_exchangeJobSearch: ExchangeJobSearchState;
}

export const reducers = {
  exchangeJobSearch: fromExchangeJobSearchReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ExchangeJobSearchState>('libs_peer_exchangeJobSearch');

// Feature Selectors
export const selectExchangeJobSearchState = createSelector(
  selectFeatureAreaState,
  (state: ExchangeJobSearchState) => state.exchangeJobSearch
);

// Exchange Job Search Selectors
export const getExchangeId = createSelector(
  selectExchangeJobSearchState,
  fromExchangeJobSearchReducer.getExchangeId
)
export const getExchangeJobs = createSelector(
  selectExchangeJobSearchState,
  fromExchangeJobSearchReducer.getExchangeJobs
);

export const getNoResultsMessage = createSelector(
  selectExchangeJobSearchState,
  fromExchangeJobSearchReducer.getNoResultsMessage
);

export const getSelectedExchangeJobs = createSelector(
  selectExchangeJobSearchState,
  fromExchangeJobSearchReducer.getSelectedExchangeJobs
);

export const getSelectedExchangeJobsCount = createSelector(
  selectExchangeJobSearchState,
  fromExchangeJobSearchReducer.getSelectedExchangeJobsCount
);
