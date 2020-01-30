import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPaymarketsReducer from './paymarkets.reducer';

// Feature area state
export interface AddJobsState {
    paymarkets: fromPaymarketsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  paymarkets: fromPaymarketsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('addJobs_reducers');

// Feature Selectors
export const selectPaymarketsState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.paymarkets
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
