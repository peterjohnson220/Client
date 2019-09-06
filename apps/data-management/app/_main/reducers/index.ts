import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTransferDataPageReducer from './transfer-data-page.reducer';

export interface DataManagementMainState {
  transferDataPage: fromTransferDataPageReducer.State;
}

export interface State extends fromRoot.State {
  data_management: DataManagementMainState;
}

export const reducers = {
  transferDataPage: fromTransferDataPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataManagementMainState>('data_management');

// Feature Selectors
export const selectTransferDataPageState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.transferDataPage
);


// Transfer Data Page
export const getTransferMethods = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getTransferMethods
);

export const getProviders = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getProviders
);

export const getSelectedTransferMethod = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getSelectedTransferMethod
);

export const getSelectedProvider = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getSelectedProvider
);

export const getTransferDataPageLoading = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getLoading
);

export const getTransferDataPageLoadingError = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getLoadingError
);

export const getValidationErrors = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getValidationErrors
);

export const getWorkflowStep = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getWorkflowStep
);
