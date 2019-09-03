import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUsersListReducer from './users-list.reducer';

// Feature area state
export interface CompanyAdminUsersListState {
  users: fromUsersListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminUsersList: CompanyAdminUsersListState;
}

// Feature area reducers
export const reducers = {
  users: fromUsersListReducer.reducer,
};

// Select Feature area
export const selectCompanyAdminUsersState =
  createFeatureSelector<CompanyAdminUsersListState>('companyAdminUserList');

// View Selectors
export const selectUsersState =
  createSelector(selectCompanyAdminUsersState, (state: CompanyAdminUsersListState) => state.users);

// Users Page State
export const getUsers =
  createSelector(selectUsersState, fromUsersListReducer.getUsers);

export const getUsersLoading =
  createSelector(selectUsersState, fromUsersListReducer.getLoading);

export const getUsersLoadingError =
  createSelector(selectUsersState, fromUsersListReducer.getLoadingError);

export const getCompany =
  createSelector(selectUsersState, fromUsersListReducer.getCompany);

export const getUserSearchTerm =
  createSelector(selectUsersState, fromUsersListReducer.getUserSearchTerm);
