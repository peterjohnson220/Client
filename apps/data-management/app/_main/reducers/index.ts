import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTransferDataPageReducer from './transfer-data-page.reducer';
import * as fromOrganizationalDataPageReducer from './organizational-data-page.reducer';

export interface DataManagementMainState {
  transferDataPage: fromTransferDataPageReducer.State;
  organizationalDataPage: fromOrganizationalDataPageReducer.State;
}

export interface State extends fromRoot.State {
  data_management: DataManagementMainState;
}

export const reducers = {
  transferDataPage: fromTransferDataPageReducer.reducer,
  organizationalDataPage: fromOrganizationalDataPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataManagementMainState>('data_management');

// Feature Selectors
export const selectTransferDataPageState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.transferDataPage
);
export const selectOrganizationalDataPageState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.organizationalDataPage
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

export const getShowAuthenticatingModal = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getShowAuthenticatingModal
);

// Organizational Data Page
export const getOrganizationalHeadersLink = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getOrganizationalHeadersLink
);

export const getOrganizationalHeadersLinkError = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getOrganizationalHeadersLinkError
);

export const getModalStateOpen = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getModalStateOpen
);
