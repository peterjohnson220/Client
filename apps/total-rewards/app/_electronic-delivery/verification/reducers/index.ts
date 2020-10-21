import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromPageReducer from './verification.page.reducer';

// Page Module State
export interface VerificationState {
  page: fromPageReducer.State;
}

// Extend root state with Page Module State
export interface State extends fromRoot.State {
  totalRewards_verification: VerificationState;
}

export const reducers = {
  page: fromPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<VerificationState>('totalRewards_verification');

// Feature Selectors
export const selectPageState = createSelector(
  selectFeatureAreaState,
  (state: VerificationState) => state.page
);

export const getStatement = createSelector(
  selectPageState,
  fromPageReducer.getStatement
);

export const getEmployeeData = createSelector(
  selectPageState,
  fromPageReducer.getEmployeeData
);

export const getIsValidating = createSelector(
  selectPageState,
  fromPageReducer.getIsValidating
);

export const getResent = createSelector(
  selectPageState,
  fromPageReducer.getResent
);

export const getTokenStatusAsync = createSelector(
  selectPageState,
  fromPageReducer.getTokenStatusAsync
);

export const getLockedUntil = createSelector(
  selectPageState,
  fromPageReducer.getLockedUntil
);
