import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLoaderSettingsReducer from 'libs/features/org-data-loader/state/reducers/loader-settings.reducer';
import * as fromOrgDataEmailRecipientsReducer from 'libs/features/loader-email-reipients/state/reducers/email-recipients.reducer';
// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanySelectorReducer from './company-selector.reducer';
import * as fromOrgDataFieldMappingsReducer from './org-data-field-mappings.reducer';
import * as fromOrgDataFilenamePatternsReducer from './org-data-filename-patterns.reducer';
import * as fromConfigurationGroupReducer from './configuration-group.reducer';

// Feature area state
export interface OrgDataLoaderState {
  companySelector: fromCompanySelectorReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  emailRecipients: fromOrgDataEmailRecipientsReducer.State;
  loaderSettings: fromLoaderSettingsReducer.State;
  orgDataFilenamePatternSet: fromOrgDataFilenamePatternsReducer.State;
  configurationGroups: fromConfigurationGroupReducer.State;
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
  configurationGroups: fromConfigurationGroupReducer.reducer
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
export const getSavingFieldMappings =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappings);
export const getSavingFieldMappingsError =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappingsError);
export const getSavingFieldMappingsSuccess =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappingsSuccess);

export const {
  selectAll: getEmailRecipients
} = fromOrgDataEmailRecipientsReducer.adapter.getSelectors(selectEmailRecipientsState);

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

export const getSavingConfigurationGroup = createSelector(
  selectConfigurationGroupsState,
  fromConfigurationGroupReducer.getSavingConfigurationGroup
);

export const getSavingConfigurationGroupError = createSelector(
  selectConfigurationGroupsState,
  fromConfigurationGroupReducer.getSavingConfigurationGroupError
);

export const getSavedConfigurationGroup = createSelector(
  selectConfigurationGroupsState,
  fromConfigurationGroupReducer.getSavedConfigurationGroup
);
