// Import root app reducer
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCompensableFactorsReducer from './compensable-factors.reducer';

export interface ComphubCrowdSourcedState {
  compensableFactors: fromCompensableFactorsReducer.State;
}

export interface State extends fromRoot.State {
  comphub_crowd_sourced: ComphubCrowdSourcedState;
}

export const reducers = {
  compensableFactors: fromCompensableFactorsReducer.reducer,
};

export const selectFeatureAreaState = createFeatureSelector<ComphubCrowdSourcedState>('comphub_crowd_sourced');

export const selectCompensableFactorsState = createSelector(
  selectFeatureAreaState,
  (state: ComphubCrowdSourcedState) => state.compensableFactors
);

// Compensable Factors

export const getCompensableFactors = createSelector(
  selectCompensableFactorsState,
  fromCompensableFactorsReducer.getCompensableFactors
);

export const getCompensableFactorsLoading = createSelector(
  selectCompensableFactorsState,
  fromCompensableFactorsReducer.getCompensableFactorsLoading
);

export const getSelectedFactors = createSelector(
  selectCompensableFactorsState,
  fromCompensableFactorsReducer.getSelectedFactors
);

export const getEducationTypes = createSelector(
  selectCompensableFactorsState,
  fromCompensableFactorsReducer.getEducationTypes
);
