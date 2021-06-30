import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMultiMatchPageReducer from './multi-match-page.reducer';
import * as fromJobsToPriceReducer from './jobs-to-price.reducer';
import * as fromModifyPricingsReducer from './modify-pricings.reducer';
import * as fromTempDataCutReducer from './temp-data-cut.reducer';

import { SharedState } from '../../../surveys/survey-search/reducers';

// Feature area state
export interface MultiMatchState extends SharedState {
  multiMatchPage: fromMultiMatchPageReducer.State;
  jobsToPrice: fromJobsToPriceReducer.State;
  modifyPricings: fromModifyPricingsReducer.State;
  tempDataCut: fromTempDataCutReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_multiMatch: MultiMatchState;
}

// Feature area reducers
export const reducers = {
  multiMatchPage: fromMultiMatchPageReducer.reducer,
  jobsToPrice: fromJobsToPriceReducer.reducer,
  modifyPricings: fromModifyPricingsReducer.reducer,
  tempDataCut: fromTempDataCutReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<MultiMatchState>('feature_multiMatch');

// Feature Selectors
export const selectMultiMatchPageState = createSelector(
  selectFeatureAreaState,
  (state: MultiMatchState) => state.multiMatchPage
);

export const selectJobsToPriceState = createSelector(
  selectFeatureAreaState,
  (state: MultiMatchState) => state.jobsToPrice
);

export const selectModifyPricingsState =
  createSelector(selectFeatureAreaState, (state: MultiMatchState) => state.modifyPricings);

export const selectTempDataCutState = createSelector(
  selectFeatureAreaState,
  (state: MultiMatchState) => !!state ? state.tempDataCut : {}
);

// Multi Match Page Selectors

export const getMultimatchProjectContext = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getProjectContext
);

export const getSavingJobMatchUpdates = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getSavingChanges
);

export const getSavingJobMatchError = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getSavingChangesError
);

export const getShowModal = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getShowModal
);

export const getLoadingJobsToPrice = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getLoadingJobs
);

export const getJobsToPrice = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getJobsToPrice
);

export const getLoadingJobsToPriceError = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getLoadingJobsError
);

// Modify Pricings
export const getPricingsToModify = createSelector(selectModifyPricingsState, fromModifyPricingsReducer.getPricingsToModify);
export const getIsSaving = createSelector(selectModifyPricingsState, fromModifyPricingsReducer.getIsSaving);
export const getHasError = createSelector(selectModifyPricingsState, fromModifyPricingsReducer.getHasError);

// Temp Data Cut
export const getTempDataCutUpsert = createSelector(selectTempDataCutState, fromTempDataCutReducer.getUpserting);
export const getTempDataCutComplete = createSelector(selectTempDataCutState, fromTempDataCutReducer.getComplete);
export const getTempDataCutFilterContextDictionary = createSelector(selectTempDataCutState, fromTempDataCutReducer.getFilterContextDictionary);
export const getTempDataCutCurrentIdentity = createSelector(selectTempDataCutState, fromTempDataCutReducer.getCurrent);
export const getTempDataCutCreating = createSelector(selectTempDataCutState, fromTempDataCutReducer.getCreating);
export const getTempDataCutEditing = createSelector(selectTempDataCutState, fromTempDataCutReducer.getEditing);

