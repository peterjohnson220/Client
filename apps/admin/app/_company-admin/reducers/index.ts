import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserRoleViewReducer from './user-role-view.reducer';

// Feature area state
export interface UserRoleViewStateMain {
  userRoleView: fromUserRoleViewReducer.IUserRoleState;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userRoleViewAdminMain: UserRoleViewStateMain;
}

// Feature area reducers
export const reducers = {
  userRoleView: fromUserRoleViewReducer.reducer
};

// Select Feature Area
export const selectUserRoleViewAdminMainState =
  createFeatureSelector<UserRoleViewStateMain>('userRoleViewAdminMain');

// User Role View Selectors
export const selectUserRoleState =
  createSelector(selectUserRoleViewAdminMainState, (state: UserRoleViewStateMain) => state.userRoleView);

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
  selectUserRoleState, fromUserRoleViewReducer.getUsersAndRoles
);

export const getUsersAndRolesError = createSelector(
  selectUserRoleState, fromUserRoleViewReducer.getUsersAndRolesError
);

