import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUpsertDataCutPageReducer from './upsert-data-cut-page.reducer';
import * as fromDataCutValidationReducer from './data-cut-validation.reducer';
import * as fromAssociateCompanyJobReducer from './associate-company-job.reducer';

// Feature area state
export interface UpsertPeerDataState {
  upsertDataCutPage: fromUpsertDataCutPageReducer.State;
  dataCutValidation: fromDataCutValidationReducer.State;
  associateCompanyJob: fromAssociateCompanyJobReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  legacy_upsertPeerData: UpsertPeerDataState;
}

// Feature area reducers
export const reducers = {
  upsertDataCutPage: fromUpsertDataCutPageReducer.reducer,
  dataCutValidation: fromDataCutValidationReducer.reducer,
  associateCompanyJob: fromAssociateCompanyJobReducer.reducer
};

// Select Feature Area
export const selectUpsertPeerDataState = createFeatureSelector<UpsertPeerDataState>('legacy_upsertPeerData');

// Feature Selectors
export const selectUpsertDataCutState = createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.upsertDataCutPage);
export const selectDataCutValidationState =
  createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.dataCutValidation);
export const selectAssociateCompanyJobState =
  createSelector(selectUpsertPeerDataState, (state: UpsertPeerDataState) => state.associateCompanyJob);

// Add Data Cut Selectors
export const getUpsertDataCutAddingDataCut = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutPageReducer.getUpsertingDataCut
);
export const getUpsertDataCutAddingDataCutError = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutPageReducer.getUpsertingDataCutError
);
export const getUpsertDataCutPageInViewInIframe = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutPageReducer.getPageInViewInIframe
);
export const getUpsertDataCutLoadingDataCutDetails = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutPageReducer.getLoadingDataCutDetails
);
export const getUpsertDataCutLoadingDataCutError = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutPageReducer.getLoadingDataCutDetailsError
);

// Data Cut Validation Selectors
export const {
  selectAll: getDataCutValidationInfo
} = fromDataCutValidationReducer.adapter.getSelectors(selectDataCutValidationState);
export const getDataCutValidationInfoLoading = createSelector(selectDataCutValidationState, fromDataCutValidationReducer.getLoading);
export const getDataCutValidationInfoLoadingError
  = createSelector(selectDataCutValidationState, fromDataCutValidationReducer.getLoadingError);

// Associate Company Job Selectors
export const getExchangeSearchResult = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getExchangeJobs
);

export const getIsLoading = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getIsLoading
);

export const getHasLoadingError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getHasLoadingError
);

export const getIsAdding = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getIsAdding
);

export const getHasAddingError = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getHasAddingError
);

export const getCompanyJob = createSelector(
  selectAssociateCompanyJobState,
  fromAssociateCompanyJobReducer.getCompanyJob
);

