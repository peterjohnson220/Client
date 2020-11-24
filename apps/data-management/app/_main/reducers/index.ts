import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCustomFieldsReducer from 'libs/features/company/custom-fields/reducers/custom-fields.reducer';
import * as fromEntityIdentifierReducer from 'libs/features/company/entity-identifier/reducers/entity-identifiers.reducer';
import * as fromEmailRecipientsReducer from 'libs/features/loader-email-reipients/state/reducers/email-recipients.reducer';
import * as fromLoaderSettingsReducer from 'libs/features/org-data-loader/state/reducers/loader-settings.reducer';
// Import root app reducer
import * as fromRoot from 'libs/state/state';

import { SelectorHelper } from '../helpers';
import * as fromTransferDataPageReducer from './transfer-data-page.reducer';
import * as fromOrganizationalDataPageReducer from './organizational-data-page.reducer';
import * as fromFieldMappingReducer from './field-mapping.reducer';
import * as fromOrgDataFieldMappingsReducer from './organizational-data-field-mapping.reducer';
import * as fromTransferScheduleReducer from './transfer-schedule.reducer';
import * as fromHrisConnectionReducer from './hris-connection.reducer';
import * as fromEntitySelectionReducer from './entity-selection.reducer';
import * as fromOutboundJdmReducer from './outbound-jdm.reducer';
import * as fromProviderListReducer from './provider-list.reducer';
import * as fromConverterSettingsReducer from './converter-settings.reducer';
import * as fromLoadersDataReducer from './loaders-data.reducer';
import * as fromLoadAndExportFilesCardReducer from './load-and-export-files-card.reducer';
import { create } from 'domain';

export interface DataManagementMainState {
  transferDataPage: fromTransferDataPageReducer.State;
  fieldMappingPage: fromFieldMappingReducer.State;
  organizationalDataPage: fromOrganizationalDataPageReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  loaderSettings: fromLoaderSettingsReducer.State;
  customFieldsData: fromCustomFieldsReducer.State;
  emailRecipients: fromEmailRecipientsReducer.State;
  transferSchedule: fromTransferScheduleReducer.State;
  hrisConnection: fromHrisConnectionReducer.State;
  entityIdentifiers: fromEntityIdentifierReducer.State;
  entitySelection: fromEntitySelectionReducer.State;
  outboundJdm: fromOutboundJdmReducer.State;
  providerList: fromProviderListReducer.State;
  converterSettings: fromConverterSettingsReducer.State;
  loadersData: fromLoadersDataReducer.State;
  loadAndExportFilesCard: fromLoadAndExportFilesCardReducer.LoadAndExportFilesCardState;
}

export interface State extends fromRoot.State {
  data_management: DataManagementMainState;
}

export const reducers = {
  transferDataPage: fromTransferDataPageReducer.reducer,
  organizationalDataPage: fromOrganizationalDataPageReducer.reducer,
  fieldMappingPage: fromFieldMappingReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer,
  loaderSettings: fromLoaderSettingsReducer.reducer,
  emailRecipients: fromEmailRecipientsReducer.reducer,
  customFieldsData: fromCustomFieldsReducer.reducer,
  transferSchedule: fromTransferScheduleReducer.reducer,
  hrisConnection: fromHrisConnectionReducer.reducer,
  entityIdentifiers: fromEntityIdentifierReducer.reducer,
  entitySelection: fromEntitySelectionReducer.reducer,
  outboundJdm: fromOutboundJdmReducer.reducer,
  providerList: fromProviderListReducer.reducer,
  converterSettings: fromConverterSettingsReducer.reducer,
  loadersData: fromLoadersDataReducer.reducer,
  loadAndExportFilesCard: fromLoadAndExportFilesCardReducer.reducer
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
export const selectLoaderSettingState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.loaderSettings
);
export const selectOrgDataCustomFieldsState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.customFieldsData
);
export const selectEmailRecipientsState =
  createSelector(selectFeatureAreaState, (state: DataManagementMainState) => state.emailRecipients);
export const selectTransferScheduleState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.transferSchedule
);
export const selectHrisConnectionState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.hrisConnection
);

export const selectEntityIdentifierState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.entityIdentifiers
);

export const selectEntitySelectionState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.entitySelection
);

export const selectOutboundJdmState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.outboundJdm,
);

export const selectProviderListState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.providerList
);

export const selectConverterSettingsState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.converterSettings
);

export const selectLoadersDataState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.loadersData
);

export const selectLoadAndExportFilesCardState = createSelector(
  selectFeatureAreaState,
  (state: DataManagementMainState) => state.loadAndExportFilesCard
);

// Transfer Data Page
export const getWorkflowStep = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getWorkflowStep
);

export const getTransferDataPageActiveConnection = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getActiveConnection
);

// provider list
export const getSelectedTransferMethod = createSelector(selectProviderListState, fromProviderListReducer.getSelectedTransferMethod);
export const getProviders = createSelector(selectProviderListState, fromProviderListReducer.getProviders);
export const getTransferMethods = createSelector(selectProviderListState, fromProviderListReducer.getTransferMethods);
export const getSelectedProvider = createSelector(selectProviderListState, fromProviderListReducer.getSelectedProvider);

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

export const getConfigurationGroups = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getConfigurationGroups
);

export const getSavedConfigurationGroup = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.getSavedConfigurationGroup
);

export const getSelectedEntities = createSelector(
  selectTransferDataPageState,
  fromTransferDataPageReducer.getSelectedEntities
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
export const getFieldMappingPageLoading = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getFieldMappingPageLoading
);
export const getFieldMappingPageLoadingError = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getFieldMappingPageLoadingError
);
export const getProviderFields = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getProviderFields
);
export const getPayfactorsFields = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getPayfactorsFields
);
export const canSaveMappings = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.canSaveMappings
);
export const savingMappings = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.savingMappings
);
export const savingMappingsError = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.savingMappingsError
);
export const isFieldMappingPageDirty = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.isFieldMappingPageDirty
);

// Default Paymarkets for Employee field mappings
export const getDefaultPaymarket = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getDefaultPaymarket
);
export const getDefaultPaymarketLoading = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getDefaultPaymarketLoading
);
export const getDefaultPaymarketLoadingError = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getDefaultPaymarketLoadingError
);
export const getDefaultPaymarketModalOpen = createSelector(
  selectFieldMappingState,
  fromFieldMappingReducer.getDefaultPaymarketModalOpen
);

// Organizational Field Mapping
export const { selectAll: getFieldMappings } = fromOrgDataFieldMappingsReducer.adapter.getSelectors(selectOrgDataFieldMappingsState);

export const getLoadingFieldMappings = createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappings);
export const getLoadingFieldMappingsError = createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappingsError);
export const getLoadingLoaderSettings = createSelector(selectLoaderSettingState, fromLoaderSettingsReducer.getLoadingLoaderSettings);
export const getLoadingLoaderSettingsError = createSelector(selectLoaderSettingState, fromLoaderSettingsReducer.getLoadingLoaderSettingsError);
export const { selectAll: getLoaderSettings } = fromLoaderSettingsReducer.adapter.getSelectors(selectLoaderSettingState);



// Custom Fields
export const getCustomJobField =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomJobFields
  );
export const getCustomJobFieldError =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomFieldsError
  );
export const getCustomEmployeeField =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetCustomEmployeeFields
  );

export const getTagCategories =
  createSelector(selectOrgDataCustomFieldsState, fromCustomFieldsReducer.GetTagCategories
  );

// Notification
export const isProcessingMapping = createSelector(
  selectOrganizationalDataPageState,
  fromOrganizationalDataPageReducer.isProcessingMapping
);

// Email Recipients
export const {
  selectAll: getEmailRecipients
} = fromEmailRecipientsReducer.adapter.getSelectors(selectEmailRecipientsState);

export const getLoadingRecipients = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getLoadingEmailRecipients
);

export const getLoadingRecipientsError = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getLoadingEmailRecipientsError
);

export const getSavingRecipient = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getSavingEmailRecipients
);

export const getSavingRecipientError = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getSavingEmailRecipientsError
);

export const getRemovingRecipient = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getRemovingEmailRecipients
);

export const getRemovingRecipientError = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getRemovingEmailRecipientsError
);

export const getEmailRecipientsModalOpen = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getEmailRecipientsModalOpen
);

export const getCreatedConfigurationGroup = createSelector(
  selectEmailRecipientsState,
  fromEmailRecipientsReducer.getCreatedConfigurationGroup
);


// Transfer Schedule
export const getTransferScheduleSummary = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getTransferScheduleSummary);
export const getTransferScheduleSummaryLoading = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getLoading);
export const getTransferScheduleSummaryError = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getLoadingError);
export const getTransferScheduleSummarySavingScheduleId = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getSavingScheduleId);
export const getTransferScheduleSummarySaving = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getSaving);
export const getTransferScheduleSummarySavingError = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getSavingError);
export const getTransferScheduleSummaryRestoreCompleted = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getRestoreCompleted);
export const getShowSetupCompleteModal = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getShowSetupCompleteModal);

// Hris Connection
export const getHrisActiveConnection = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getConnection);
export const getHrisConnectionLoading = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getLoading);
export const getHrisConnectionLoadingError = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getLoadingError);
export const getHrisActiveConnectionSaving = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getSaving);
export const getHrisActiveConnectionSavingError = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getSavingError);
export const getHrisActiveConnectionDeleteCompleted = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getDeleteCompleted);
export const getHrisConnectionSummary = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getConnectionSummary);
export const getIsValidCredentials = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getIsValidCredentials);
export const getValidationErrors = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getValidationErrors);
export const getShowAuthenticationWarning = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getShowAuthenticationWarning);
export const getActiveConnectionId = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getActiveConnectionId);
export const getHrisReauthenticationModalOpen = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getReauthenticationModalOpen);
export const getFullReplaceModes = createSelector(selectHrisConnectionState, fromHrisConnectionReducer.getFullReplaceModes);

// entity identifiers
export const getEmployeeIdentifiers = createSelector(selectEntityIdentifierState, fromEntityIdentifierReducer.GetEmployeeIdentifiers);
export const hasEntityIdDataError = createSelector(selectEntityIdentifierState, fromEntityIdentifierReducer.HasDataError);
export const isFetchingEntityIdData = createSelector(selectEntityIdentifierState, fromEntityIdentifierReducer.IsFetchingData);
export const hasSavedEntityIdData = createSelector(selectEntityIdentifierState, fromEntityIdentifierReducer.HasSavedEmployeeIdentifiers);

// entity selection page
export const getProviderSupportedEntitiesObj = createSelector(selectEntitySelectionState, fromEntitySelectionReducer.getProviderSupportedEntitiesObj);
export const getEntitySelectionSavingObj = createSelector(selectEntitySelectionState, fromEntitySelectionReducer.getUpdatedProviderSupportedEntitiesObj);
export const getEntitySelectionShouldRedirect = createSelector(getHrisConnectionSummary, getSelectedProvider, (s1, s2) => {
  return SelectorHelper.getEntitySelectionPageRedirectionStatus(s1, s2);
});
export const getEntitySelectionPageSelections = createSelector(getSelectedEntities, getProviderSupportedEntitiesObj, (s1, s2) => {
  return { selections: s1, providerSupportedEntities: s2.obj };
});
export const getShowRemoveEntityModal = createSelector(selectEntitySelectionState, fromEntitySelectionReducer.getShowRemoveEntityModal);

// converter settings
export const getConverterSettings = createSelector(selectConverterSettingsState, fromConverterSettingsReducer.getConverterSettings);
export const getGlobalDateSetting = createSelector(selectConverterSettingsState, fromConverterSettingsReducer.getGlobalDateSetting);
export const getDataConverterModalInfo = createSelector(selectConverterSettingsState, fromConverterSettingsReducer.getDataConverterModalInfo);
export const isDataConverterModalOpen = createSelector(selectConverterSettingsState, fromConverterSettingsReducer.isDataConverterModalOpen);

// Outbound
export const getOutboundProviders = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundProviders);
export const getOutboundSelectedProvider = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundSelectedProvider);
export const getOutboundSelectedTransferMethod = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundSelectedTransferMethod);
export const getOutboundTransferMethods = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundTransferMethods);
export const getOutboundWorkflowStep = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundWorkflowStep);
export const getOutboundJdmViews = createSelector(selectTransferDataPageState, fromTransferDataPageReducer.getOutboundJdmViews);
export const getOutboundTransferSummaryObj = createSelector(selectTransferScheduleState, fromTransferScheduleReducer.getOutboundTransferSummaryObj);

// outbound jdm summary
export const getJdmConnectionSummaryObj = createSelector(selectOutboundJdmState, fromOutboundJdmReducer.getConnectionSummary);
export const getOutboundTransferSummaryWidget = createSelector(getOutboundTransferSummaryObj, getOutboundJdmViews, (s1, s2) => {
  return { summary: s1, views: s2 };
});

// loaders data
export const getLatestOrgDataLoad = createSelector(selectLoadersDataState, fromLoadersDataReducer.getLatestOrgDataLoad);
export const getLatestOrgDataLoadModalOpen = createSelector(selectLoadersDataState, fromLoadersDataReducer.getLatestOrgDataLoadModalOpen);

// load and export files card
export const getLoadAndExportFilesCardState = createSelector(
  selectLoadAndExportFilesCardState,
  fromLoadAndExportFilesCardReducer.getLoadAndExportFilesCardState);
export const getLoadAndExportFilesCardStateLoading = createSelector(
  selectLoadAndExportFilesCardState,
  fromLoadAndExportFilesCardReducer.getLoadAndExportFilesCardStateLoading);
