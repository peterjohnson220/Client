import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserRoleViewReducer from './user-role-view.reducer';
import * as fromUserRoleUserTabReducer from './user-role-users-tab.reducer';
import * as fromUserRoleFunctionTabReducer from './user-role-functions-tab.reducer';
import * as fromNavigationReducer from './navigation.reducer';
import * as fromDataAccessTabReducer from './role-data-access-tab.reducer';
import * as fromPasswordSettingsReducer from './password-setting.reducer';
import * as fromUserReducer from './user.reducer';

// Feature area state
export interface CompanyAdminStateMain {
  userRoleView: fromUserRoleViewReducer.IUserRoleState;
  userRoleUserTab: fromUserRoleUserTabReducer.State;
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.State;
  navigation: fromNavigationReducer.State;
  dataAccessTab: fromDataAccessTabReducer.State;
  passwordSettings: fromPasswordSettingsReducer.State;
  userForm: fromUserReducer.IUserState;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminMain: CompanyAdminStateMain;
}

// Feature area reducers
export const reducers = {
  userRoleView: fromUserRoleViewReducer.reducer,
  userRoleUserTab: fromUserRoleUserTabReducer.reducer,
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.reducer,
  navigation: fromNavigationReducer.reducer,
  dataAccessTab: fromDataAccessTabReducer.reducer,
  passwordSettings: fromPasswordSettingsReducer.reducer,
  userForm: fromUserReducer.reducer
};

// Select Feature Area
export const selectCompanyAdminMainState =
  createFeatureSelector<CompanyAdminStateMain>('companyAdminMain');

// View Selectors
export const selectUserRoleState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.userRoleView);

export const selectUserRoleFunctionTabState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.userRoleFunctionTab);

export const selectRoleDataAccessTabState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.dataAccessTab);

export const selectUserRoleUserTabState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.userRoleUserTab);

export const selectNavigationState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.navigation);

export const selectPasswordSettingsState =
  createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.passwordSettings);

export const selectUserFormState =
    createSelector(selectCompanyAdminMainState, (state: CompanyAdminStateMain) => state.userForm);

// Select User Role
export const getUserRoleViewState = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getUserRoleViewState
);

export const getUserRoleCurrentTabState = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getUserRoleCurrentTab
);

export const getCurrentUserRole = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getCurrentUserRole
);

export const getCompanyRoles = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getCompanyRoles
);

export const getAddCompanyRoleModalIsOpen = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getAddCompanyRoleModalIsOpen
);

export const getAddCompanyRoleForm = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getAddCompanyRoleForm
);

export const getAddCompanyRoleError = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getAddCompanyRoleError
);

export const getRoleApiResponse = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getRoleApiResponse
);

export const getSaveButtonDisabled = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getSaveButtonDisabled
);

// Functions tab
export const getFunctionTabPermissions = createSelector(
  selectUserRoleFunctionTabState, fromUserRoleFunctionTabReducer.getFunctionTabPermissions
);

export const getFunctionTabPendingChanges = createSelector(
  selectUserRoleFunctionTabState, fromUserRoleFunctionTabReducer.getFunctionTabPendingChanges
);

export const getCurrentCheckedPermissionIds = createSelector(
  selectUserRoleFunctionTabState, fromUserRoleFunctionTabReducer.getCheckedPermissions
);

export const getCheckboxesDisabled = createSelector(
  selectUserRoleFunctionTabState, fromUserRoleFunctionTabReducer.getCheckboxesDisabled
);

// Users tab
export const getUsersAndRoles = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUsersAndRoles
);

export const getUsersInActiveRole = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUsersInActiveRole
);

export const getUsersNotInActiveRole = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUsersNotInActiveRole
);

export const getUsersTabHasPendingChanges = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUsersTabHasPendingChanges
);

export const getUserIdsToSave = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUserIdsToSave
);

// Navigation Links
export const getLinks = createSelector(
  selectNavigationState, fromNavigationReducer.getLinks
);

export const getNavigationLinksLoading = createSelector(
  selectNavigationState, fromNavigationReducer.getLoading
);

export const getNavigationLinksLoadingError = createSelector(
  selectNavigationState, fromNavigationReducer.getLoadingError
);

// Data Access Tab

export const getDataTypes = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getDataTypes
);

export const getRoleDataRestrictions = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getRoleDataRestrictions
);

export const getRoleDataRestrictionsForSave = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getRoleDataRestrictionsForSave
);

export  const getDataAccessTabPendingChanges = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getDataAccessTabHasPendingChanges
);


// Password Settings
export const getPasswordSettings = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getPasswordSettings
);

export const getPasswordSettingsLoading = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getLoading
);

export const getPasswordSettingsLoadingError = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getLoadingError
);

export const getPasswordSettingsModalOpen = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaveModalOpen
);

export const getPasswordSettingsSaveRequest = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaveRequest
);

export const getPasswordSettingsSaving = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaving
);

export const getPasswordSettingsSavingError = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSavingError
);

// User Form
export const getUserState = createSelector(
  selectUserFormState, fromUserReducer.getUserState
);

export const getUserStateRoles = createSelector(
  selectUserFormState, fromUserReducer.getRoles
);

export const getUserStateUser = createSelector(
  selectUserFormState, fromUserReducer.getUser
);

export const getUserStateLoading = createSelector(
  selectUserFormState, fromUserReducer.getUserLoading
);

export const getUserStateLoaded = createSelector(
  selectUserFormState, fromUserReducer.getUserLoaded
);

export const getUserStateApiError = createSelector(
  selectUserFormState, fromUserReducer.getUserApiError
);
