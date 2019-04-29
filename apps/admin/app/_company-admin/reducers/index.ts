import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserRoleViewReducer from './user-role-view.reducer';
import * as fromUserRoleUserTabReducer from './user-role-users-tab.reducer';
import * as fromUserRoleFunctionTabReducer from './user-role-functions-tab.reducer';
import * as fromNavigationReducer from './navigation.reducer';
import * as fromDataAccessTabReducer from './role-data-access-tab.reducer';

// Feature area state
export interface UserRoleViewStateMain {
  userRoleView: fromUserRoleViewReducer.IUserRoleState;
  userRoleUserTab: fromUserRoleUserTabReducer.State;
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.State;
  navigation: fromNavigationReducer.State;
  dataAccessTab: fromDataAccessTabReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userRoleAdminMain: UserRoleViewStateMain;
}

// Feature area reducers
export const reducers = {
  userRoleView: fromUserRoleViewReducer.reducer,
  userRoleUserTab: fromUserRoleUserTabReducer.reducer,
  userRoleFunctionTab: fromUserRoleFunctionTabReducer.reducer,
  navigation: fromNavigationReducer.reducer,
  dataAccessTab: fromDataAccessTabReducer.reducer
};

// Select Feature Area
export const selectUserRoleAdminMainState =
  createFeatureSelector<UserRoleViewStateMain>('userRoleAdminMain');

// User Role View Selectors
export const selectUserRoleState =
  createSelector(selectUserRoleAdminMainState, (state: UserRoleViewStateMain) => state.userRoleView);

export const selectUserRoleFunctionTabState =
  createSelector(selectUserRoleAdminMainState, (state: UserRoleViewStateMain) => state.userRoleFunctionTab);

export const selectRoleDataAccessTabState =
  createSelector(selectUserRoleAdminMainState, (state: UserRoleViewStateMain) => state.dataAccessTab);

export const selectUserRoleUserTabState =
  createSelector(selectUserRoleAdminMainState, (state: UserRoleViewStateMain) => state.userRoleUserTab);

export const selectNavigationState =
  createSelector(selectUserRoleAdminMainState, (state: UserRoleViewStateMain) => state.navigation);

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

export const getUsersAndRolesError = createSelector(
  selectUserRoleUserTabState, fromUserRoleUserTabReducer.getUsersAndRolesError
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

export  const getDataAccessTabPendingChanges = createSelector(
  selectRoleDataAccessTabState, fromDataAccessTabReducer.getDataAccessTabHasPendingChanges
);
