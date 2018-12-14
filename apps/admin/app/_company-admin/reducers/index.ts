import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserRoleViewReducer from './user-role-view.reducer';
import * as fromUserRoleUserTabReducer from './user-role-users-tab.reducer';

// Feature area state
export interface UserRoleViewStateMain {
  userRoleView: fromUserRoleViewReducer.IUserRoleState;
  userRoleUserTab: fromUserRoleUserTabReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userRoleAdminMain: UserRoleViewStateMain;
}

// Feature area reducers
export const reducers = {
  userRoleView: fromUserRoleViewReducer.reducer,
  userRoleUserTab: fromUserRoleUserTabReducer.reducer
};

// Select Feature Area
export const selectuserRoleAdminMainState =
  createFeatureSelector<UserRoleViewStateMain>('userRoleAdminMain');

// User Role View Selectors
export const selectUserRoleState =
  createSelector(selectuserRoleAdminMainState, (state: UserRoleViewStateMain) => state.userRoleView);

export const userRoleUserTabState =
  createSelector(selectuserRoleAdminMainState, (state: UserRoleViewStateMain) => state.userRoleUserTab);

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

export const getFunctionSaveButtonText = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getFunctionSaveButtonText
);

// Users tab
export const getUsersAndRoles = createSelector(
  userRoleUserTabState, fromUserRoleUserTabReducer.getUsersAndRoles
);

export const getUsersAndRolesError = createSelector(
  userRoleUserTabState, fromUserRoleUserTabReducer.getUsersAndRolesError
);

export const getUsersInActiveRole = createSelector(
  userRoleUserTabState, fromUserRoleUserTabReducer.getUsersInActiveRole
);

export const getUsersNotInActiveRole = createSelector(
  userRoleUserTabState, fromUserRoleUserTabReducer.getUsersNotInActiveRole
);

export const getUsersTabSaveButtonText = createSelector(
  userRoleUserTabState, fromUserRoleUserTabReducer.getUsersTabSaveButtonText
);
