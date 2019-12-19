import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLoaderSettingsReducer from 'libs/features/org-data-loader/state/reducers/loader-settings.reducer';
// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromTransferDataPageReducer from './transfer-data-page.reducer';
import * as fromOrganizationalDataPageReducer from './organizational-data-page.reducer';
import * as fromFieldMappingReducer from './field-mapping.reducer';
import * as fromOrgDataFieldMappingsReducer from './organizational-data-field-mapping.reducer';
import * as fromFileUploadReducer from './file-upload.reducer';
import * as fromCustomFieldsReducer from './custom-fields.reducer';

export interface DataManagementMainState {
  transferDataPage: fromTransferDataPageReducer.State;
  fieldMappingPage: fromFieldMappingReducer.State;
  organizationalDataPage: fromOrganizationalDataPageReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  fileUploadPage: fromFileUploadReducer.State;
  loaderSettings: fromLoaderSettingsReducer.State;
  customFieldsData: fromCustomFieldsReducer.State;
}

export interface State extends fromRoot.State {
  data_management: DataManagementMainState;
}

export const reducers = {
  transferDataPage: fromTransferDataPageReducer.reducer,
  organizationalDataPage: fromOrganizationalDataPageReducer.reducer,
  fieldMappingPage: fromFieldMappingReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer,
  fileUploadPage: fromFileUploadReducer.reducer,
  loaderSettings: fromLoaderSettingsReducer.reducer,
  customFieldsData: fromCustomFieldsReducer.reducer
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
  (state: DataManagementMainState) => state.fileUploadPage);

export const selectLoaderSettingState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.loaderSettings
);

export const selectOrgDataCustomFieldsState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.customFieldsData
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

export const getHasError = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getHasError
);

export const getConfigurationGroup = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getConfigurationGroup
);

export const getSavedConfigurationGroup = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getSavedConfigurationGroup
);

export const getSelectedEntities = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getSelectedEntities
);
export const getProviderSupportedEntities = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getProviderSupportedEntities
);
export const fileUploadData = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.fileUploadData
);

export const fileUploadDataFailed = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.fileUploadDataFailed
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
export const { selectAll: getFieldMappings } = fromOrgDataFieldMappingsReducer.adapter.getSelectors(selectOrgDataFieldMappingsState);

export const getLoadingFieldMappings = createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappings);
export const getLoadingFieldMappingsError = createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappingsError);
export const getLoadingLoaderSettings = createSelector(selectLoaderSettingState, fromLoaderSettingsReducer.getLoadingLoaderSettings);
export const getLoadingLoaderSettingsError = createSelector(selectLoaderSettingState, fromLoaderSettingsReducer.getLoadingLoaderSettingsError);
export const { selectAll: getLoaderSettings } = fromLoaderSettingsReducer.adapter.getSelectors(selectLoaderSettingState);


// File Upload

export const getColumnNames = createSelector(
  selectOrgDataFileUploadState,
  fromFileUploadReducer.GetColumnNames
);

export const getColumnNamesError = createSelector(
  selectOrgDataFileUploadState,
  fromFileUploadReducer.GetColumnNamesError
);
// Custom Fields
export const getCustomJobField =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomJobFields
);
export const getCustomJobFieldError =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomJobFieldsError
);
export const getCustomEmployeeField =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomEmployeeField
);
export const getCustomEmployeeFieldError =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomEmployeeFieldError
);

// Notification
export const isProcessingMapping = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.isProcessingMapping
);
