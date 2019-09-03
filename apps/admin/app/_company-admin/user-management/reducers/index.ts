import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUserManagementReducer from './user-management.reducer';

// Feature area state
export interface CompanyAdminUserManagementState {
  userForm: fromUserManagementReducer.IUserState;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminUserManagement: CompanyAdminUserManagementState;
}

// Feature area reducers
export const reducers = {
  userForm: fromUserManagementReducer.reducer
};

// Select Feature Area
export const selectCompanyAdminUserManagementState =
  createFeatureSelector<CompanyAdminUserManagementState>('companyAdminUserManagement');

// View Selectors
export const selectUserFormState =
  createSelector(selectCompanyAdminUserManagementState, (state: CompanyAdminUserManagementState) => state.userForm);


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
