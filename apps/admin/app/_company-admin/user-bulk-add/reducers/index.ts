import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserBulkAddReducer from './user-bulk-add.reducer';

// Feature area state
export interface CompanyAdminUserBulkAddState {
  userBulkAddSettings: fromUserBulkAddReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminUserBulkAddSettings: CompanyAdminUserBulkAddState;
}

// Feature area reducers
export const reducers = {
  userBulkAddSettings: fromUserBulkAddReducer.reducer,
};

// Select Feature Area
export const selectCompanyAdminUserBulkAddState =
  createFeatureSelector<CompanyAdminUserBulkAddState>('companyAdminUserBulkAddSettings');

// View Selectors
export const selectUserBulkAddState =
  createSelector(selectCompanyAdminUserBulkAddState, (state: CompanyAdminUserBulkAddState) => state.userBulkAddSettings);

// User Bulk Add Settings
export const getLoaderState = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getLoaderState
);

export const getWorksheetNames = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getWorksheetNames
);

export const getStoreFileNameInSession = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreFileNameInSession
);

export const getStoreFileNameInSessionSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreFileNameInSessionSuccess
);

export const getStoreFileNameInSessionError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreFileNameInSessionError
);

export const getStoreAndMapBulkAddUsersInSession = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreAndMapBulkAddUsersInSession
);

export const getStoreAndMapBulkAddUsersInSessionSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreAndMapBulkAddUsersInSessionSuccess
);

export const getStoreAndMapBulkAddUsersInSessionError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getStoreAndMapBulkAddUsersInSessionError
);

export const getSaveUsers = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getSaveUsers
);

export const getSaveUsersSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getSaveUsersSuccess
);

export const getSaveUsersError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getSaveUsersError
);

export const getImportCount = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getImportCount
);

export const getImportCountSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getImportCountSuccess
);

export const getImportCountError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getImportCountError
);

export const getValidateHeaders = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateHeaders
);

export const getValidateHeadersSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateHeadersSuccess
);

export const getValidateHeadersError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateHeadersError
);

export const getValidateRequiredFields = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateRequiredFields
);

export const getValidateRequiredFieldsSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateRequiredFieldsSuccess
);

export const getValidateRequiredFieldsError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateRequiredFieldsError
);

export const getValidateEmails = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateEmails
);

export const getValidateEmailsSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateEmailsSuccess
);

export const getValidateEmailsError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateEmailsError
);


export const getValidatePasswords = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidatePasswords
);

export const getValidatePasswordsSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidatePasswordsSuccess
);

export const getValidatePasswordsError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidatePasswordsError
);


export const getValidateUserRoles = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateUserRoles
);

export const getValidateUserRolesSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateUserRolesSuccess
);

export const getValidateUserRolesError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getValidateUserRolesError
);

export const getDownloadDataFileWithErrors = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getDownloadDataFileWithErrors
);

export const getDownloadDataFileWithErrorsSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getDownloadDataFileWithErrorsSuccess
);

export const getDownloadDataFileWithErrorsError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getDownloadDataFileWithErrorsError
);

export const getCompanyPasswordLength = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getCompanyPasswordLength
);

export const getCompanyPasswordLengthSuccess = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getCompanyPasswordLengthSuccess
);

export const getCompanyPasswordLengthError = createSelector(
  selectUserBulkAddState, fromUserBulkAddReducer.getCompanyPasswordLengthError
);






