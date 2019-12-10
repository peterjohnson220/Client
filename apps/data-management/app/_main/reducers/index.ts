import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTransferDataPageReducer from './transfer-data-page.reducer';
import * as fromOrganizationalDataPageReducer from './organizational-data-page.reducer';
import * as fromFieldMappingReducer from './field-mapping.reducer';
import * as fromOrgDataFieldMappingsReducer from './organizational-data-field-mapping.reducer';
import * as fromFileUploadReducer from './file-upload.reducer';

export interface DataManagementMainState {
  transferDataPage: fromTransferDataPageReducer.State;
  fieldMappingPage: fromFieldMappingReducer.State;
  organizationalDataPage: fromOrganizationalDataPageReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  fileUploadPage: fromFileUploadReducer.State;
}

export interface State extends fromRoot.State {
  data_management: DataManagementMainState;
}

export const reducers = {
  transferDataPage: fromTransferDataPageReducer.reducer,
  organizationalDataPage: fromOrganizationalDataPageReducer.reducer,
  fieldMappingPage: fromFieldMappingReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer,
  fileUploadPage: fromFileUploadReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataManagementMainState>('data_management');

// Feature Selectors
export const selectTransferDataPageState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.transferDataPage
);
export const selectFieldMappingState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.fieldMappingPage
);
export const selectOrganizationalDataPageState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.organizationalDataPage
);
export const selectOrgDataFieldMappingsState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.orgDataFieldMappings
);
export const selectOrgDataFileUploadState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.fileUploadPage
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


export const getSelectedEntities = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getSelectedEntities
);

// Field Mapping Card
export const getFieldMappingCardLoading = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getFieldMappingCardLoading
);
export const getFieldMappingCardLoadingError = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getFieldMappingCardLoadingError
);
export const getProviderFields = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getProviderFields
);
export const getPayfactorsFields = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getPayfactorsFields
);
// Organizational Field Mapping
export const {
  selectAll: getFieldMappings
} = fromOrgDataFieldMappingsReducer.adapter.getSelectors(selectOrgDataFieldMappingsState);
export const getLoadingFieldMappings =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappings);
export const getLoadingFieldMappingsError =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappingsError);

// File Upload

export const getColumnNames = createSelector(
  selectOrgDataFileUploadState,
  fromFileUploadReducer.GetColumnNames
);

export const getColumnNamesError = createSelector(
  selectOrgDataFileUploadState,
  fromFileUploadReducer.GetColumnNamesError
);
