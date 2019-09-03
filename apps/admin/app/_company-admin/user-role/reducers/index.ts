import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserRoleViewReducer from './user-role-view.reducer';
import * as fromUserRoleUserTabReducer from './user-role-users-tab.reducer';
import * as fromUserRoleFunctionTabReducer from './user-role-functions-tab.reducer';
import * as fromDataAccessTabReducer from './role-data-access-tab.reducer';

// Feature area state
export interface CompanyAdminUserRolesState {
  userRoleView: fromUserRoleViewReducer.IUserRoleState;
  userRoleUserTab: fromUserRoleUserTabReducer.State;
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.State;
  dataAccessTab: fromDataAccessTabReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminUserRoles: CompanyAdminUserRolesState;
}

// Feature area reducers
export const reducers = {
  userRoleView: fromUserRoleViewReducer.reducer,
  userRoleUserTab: fromUserRoleUserTabReducer.reducer,
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.reducer,
  dataAccessTab: fromDataAccessTabReducer.reducer,
};

// Select Feature Area
export const selectCompanyAdminUserRolesState =
  createFeatureSelector<CompanyAdminUserRolesState>('companyAdminUserRoles');

// View Selectors
export const selectUserRoleState =
  createSelector(selectCompanyAdminUserRolesState, (state: CompanyAdminUserRolesState) => state.userRoleView);

export const selectUserRoleFunctionTabState =
  createSelector(selectCompanyAdminUserRolesState, (state: CompanyAdminUserRolesState) => state.userRoleFunctionTab);

export const selectRoleDataAccessTabState =
  createSelector(selectCompanyAdminUserRolesState, (state: CompanyAdminUserRolesState) => state.dataAccessTab);

export const selectUserRoleUserTabState =
  createSelector(selectCompanyAdminUserRolesState, (state: CompanyAdminUserRolesState) => state.userRoleUserTab);

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

export const getDataAccessTabPendingChanges = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getDataAccessTabHasPendingChanges
);
