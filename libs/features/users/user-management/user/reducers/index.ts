import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserManagementReducer from './user-management.reducer';

// Feature area state
export interface UserManagementUserState {
  userForm: fromUserManagementReducer.IUserState;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_usermanagement_user: UserManagementUserState;
}

// Feature area reducers
export const reducers = {
  userForm: fromUserManagementReducer.reducer
};

// Select Feature Area
export const selectUserManagementUserState =
  createFeatureSelector<UserManagementUserState>('feature_usermanagement_user');

// View Selectors
export const selectUserFormState =
  createSelector(selectUserManagementUserState, (state: UserManagementUserState) => state.userForm);


// User Form
export const getUserState = createSelector(
  selectUserFormState, fromUserManagementReducer.getUserState
);

export const getUserStateRoles = createSelector(
  selectUserFormState, fromUserManagementReducer.getRoles
);

export const getUserStateUser = createSelector(
  selectUserFormState, fromUserManagementReducer.getUser
);

export const getUserStateLoading = createSelector(
  selectUserFormState, fromUserManagementReducer.getUserLoading
);

export const getUserStateLoaded = createSelector(
  selectUserFormState, fromUserManagementReducer.getUserLoaded
);

export const getUserStateApiError = createSelector(
  selectUserFormState, fromUserManagementReducer.getUserApiError
);

export const getCompanySubsidiaryInfo = createSelector(
  selectUserFormState, fromUserManagementReducer.getCompanySubsidiaryInfo
);
