import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanySelectorReducer from './company-selector.reducer';
import * as fromOrgDataFieldMappingsReducer from './org-data-field-mappings.reducer';
import * as fromOrgDataEmailRecipientsReducer from './email-recipients.reducer';

// Feature area state
export interface OrgDataLoaderState {
  companySelector: fromCompanySelectorReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
  emailRecipients: fromOrgDataEmailRecipientsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  orgDataLoader: OrgDataLoaderState;
}

// Feature area reducers
export const reducers = {
  companySelector: fromCompanySelectorReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer,
  emailRecipients: fromOrgDataEmailRecipientsReducer.reducer
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

export const {
  selectAll: getCompanies
} = fromCompanySelectorReducer.adapter.getSelectors(selectCompanySelectorState);

export const getCompaniesLoading =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompanies);
export const getCompaniesLoadingError =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompaniesError);

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
