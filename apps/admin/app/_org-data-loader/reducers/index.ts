import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCustomFieldsReducer from 'libs/features/company/custom-fields/reducers/custom-fields.reducer';
import * as fromEntityIdentifierReducer from 'libs/features/company/entity-identifier/reducers/entity-identifiers.reducer';
import * as fromOrgDataEmailRecipientsReducer from 'libs/features/loader-email-reipients/state/reducers/email-recipients.reducer';
import * as fromLoaderSettingsReducer from 'libs/features/org-data-loader/state/reducers/loader-settings.reducer';
// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanySelectorReducer from './company-selector.reducer';
import * as fromOrgDataFieldMappingsReducer from './org-data-field-mappings.reducer';
import * as fromOrgDataFilenamePatternsReducer from './org-data-filename-patterns.reducer';
import * as fromConfigurationGroupReducer from './configuration-group.reducer';
import * as fromSftpUserReducer from './sftp-user.reducer';
import * as fromOrgDataConfigurationReducer from './org-data-configuration.reducer';

// Feature area state
export interface OrgDataLoaderState {
  companySelector: fromCompanySelectorReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  emailRecipients: fromOrgDataEmailRecipientsReducer.State;
  loaderSettings: fromLoaderSettingsReducer.State;
  orgDataFilenamePatternSet: fromOrgDataFilenamePatternsReducer.State;
  configurationGroups: fromConfigurationGroupReducer.State;
  sftpUser: fromSftpUserReducer.State;
  orgDataConfiguration: fromOrgDataConfigurationReducer.State;
  entityIdentifiers: fromEntityIdentifierReducer.State;
  customFields: fromCustomFieldsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  orgDataLoader: OrgDataLoaderState;
}

// Feature area reducers
export const reducers = {
  companySelector: fromCompanySelectorReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer,
  emailRecipients: fromOrgDataEmailRecipientsReducer.reducer,
  loaderSettings: fromLoaderSettingsReducer.reducer,
  orgDataFilenamePatternSet: fromOrgDataFilenamePatternsReducer.reducer,
  configurationGroups: fromConfigurationGroupReducer.reducer,
  sftpUser: fromSftpUserReducer.reducer,
  orgDataConfiguration: fromOrgDataConfigurationReducer.reducer,
  entityIdentifiers: fromEntityIdentifierReducer.reducer,
  customFields: fromCustomFieldsReducer.reducer
};

// Select Feature Area
export const selectorgDataAutoloaderState = createFeatureSelector<OrgDataLoaderState>('orgDataLoader');

// Feature Selectors
export const selectCompanySelectorState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.companySelector);
export const selectOrgDataFieldMappingsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.orgDataFieldMappings);
export const selectEmailRecipientsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.emailRecipients);
export const selectLoaderSettingsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.loaderSettings);
export const selectOrgDataFilenamePatternSetState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.orgDataFilenamePatternSet);
export const selectConfigurationGroupsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.configurationGroups);
export const selectSftpUserState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.sftpUser);
export const selectOrgDataConfigurationState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.orgDataConfiguration);
export const selectEntityIdentifierState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.entityIdentifiers);
export const selectCustomFieldsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.customFields);

export const {
  selectAll: getCompanies
} = fromCompanySelectorReducer.adapter.getSelectors(selectCompanySelectorState);

export const getCompaniesLoading =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompanies);
export const getCompaniesLoadingError =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompaniesError);

export const {
  selectAll: getFieldMappings
} = fromOrgDataFieldMappingsReducer.adapter.getSelectors(selectOrgDataFieldMappingsState);
export const getLoadingFieldMappings =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappings);
export const getLoadingFieldMappingsError =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getLoadingFieldMappingsError);

export const {
  selectAll: getEmailRecipients
} = fromOrgDataEmailRecipientsReducer.adapter.getSelectors(selectEmailRecipientsState);

export const getEntityIdentifiers = createSelector(selectEntityIdentifierState, fromEntityIdentifierReducer.GetEmployeeIdentifiers);
export const getCustomJobFields = createSelector(selectCustomFieldsState, fromCustomFieldsReducer.GetCustomJobFields);
export const getTagCategories = createSelector(selectCustomFieldsState, fromCustomFieldsReducer.GetTagCategories);
export const getCustomEmployeeFields = createSelector(selectCustomFieldsState, fromCustomFieldsReducer.GetCustomEmployeeFields);


export const getLoadingRecipients = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getLoadingEmailRecipients
);

export const getLoadingRecipientsError = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getLoadingEmailRecipientsError
);

export const getSavingRecipient = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getSavingEmailRecipients
);

export const getSavingRecipientError = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getSavingEmailRecipientsError
);

export const getRemovingRecipient = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getRemovingEmailRecipients
);

export const getRemovingRecipientError = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getRemovingEmailRecipientsError
);

export const getEmailRecipientsModalOpen = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getEmailRecipientsModalOpen
);

export const getCreatedConfigurationGroup = createSelector(
  selectEmailRecipientsState,
  fromOrgDataEmailRecipientsReducer.getCreatedConfigurationGroup
);

export const {
  selectAll: getLoaderSettings
} = fromLoaderSettingsReducer.adapter.getSelectors(selectLoaderSettingsState);

export const getLoadingLoaderSettings = createSelector(
  selectLoaderSettingsState,
  fromLoaderSettingsReducer.getLoadingLoaderSettings
);

export const getLoadingLoaderSettingsError = createSelector(
  selectLoaderSettingsState,
  fromLoaderSettingsReducer.getLoadingLoaderSettingsError
);

export const getLoaderSettingsSaving = createSelector(
  selectLoaderSettingsState,
  fromLoaderSettingsReducer.getSavingLoaderSettings
);

export const getLoaderSettingsSavingSuccess = createSelector(
  selectLoaderSettingsState,
  fromLoaderSettingsReducer.getSavingLoaderSettingsSuccess
);

export const getLoaderSettingsSavingError = createSelector(
  selectLoaderSettingsState,
  fromLoaderSettingsReducer.getSavingLoaderSettingsError
);

export const getOrgDataFilenamePatternSet = createSelector(
  selectOrgDataFilenamePatternSetState,
  fromOrgDataFilenamePatternsReducer.getOrgDataFilenamePatternSet
);

export const {
  selectAll: getConfigurationGroups
} = fromConfigurationGroupReducer.adapter.getSelectors(selectConfigurationGroupsState);

export const getLoadingConfigurationGroups = createSelector(
  selectConfigurationGroupsState,
  fromConfigurationGroupReducer.getLoadingConfigurationGroups
);

export const getLoadingConfigurationGroupsError = createSelector(
  selectConfigurationGroupsState,
  fromConfigurationGroupReducer.getLoadingConfigurationGroupsError
);

// Sftp User

export const getSftpUser = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getSftpUser
);

export const getSftpUserName = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getSftpUserName
);

export const getSftpPublicKey = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getSftpPublicKey
);

export const getLoadingSftpUser = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getLoadingSftpUser
);

export const getLoadingSftpUserError = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getLoadingSftpUserError
);

export const getValidatingUserName = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getValidatingUserName
);

export const getValidatingUserNameError = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getValidatingUserNameError
);

export const getIsUserNameValid = createSelector(
  selectSftpUserState,
  fromSftpUserReducer.getIsUserNameValid
);

// Autoloader Configuration

export const getSavingConfiguration = createSelector(
  selectOrgDataConfigurationState,
  fromOrgDataConfigurationReducer.getSavingConfiguration
);

export const getSavingConfigurationSuccess = createSelector(
  selectOrgDataConfigurationState,
  fromOrgDataConfigurationReducer.getSavingConfigurationSuccess
);

export const getSavingConfigurationError = createSelector(
  selectOrgDataConfigurationState,
  fromOrgDataConfigurationReducer.getSavingConfigurationError
);
