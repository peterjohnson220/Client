import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromUsersListReducer from './users-list.reducer';


export interface UserManagementState {
  users: fromUsersListReducer.State;
}

export interface State extends fromRoot.State {
  userManagement: UserManagementState;
}

export const reducers = {
  users: fromUsersListReducer.reducer,
};

// Select Feature area
export const selectFeatureAreaState = createFeatureSelector<UserManagementState>('pf-admin_users');

// Users Page State
export const selectUsersState =
  createSelector( selectFeatureAreaState, (state: UserManagementState) => state.users);

export const getUsers =
  createSelector( selectUsersState, fromUsersListReducer.getUsers);

export const getUsersLoading =
  createSelector( selectUsersState, fromUsersListReducer.getLoading);

export const getUsersLoadingError =
  createSelector( selectUsersState, fromUsersListReducer.getLoadingError);

export const getCompany =
  createSelector( selectUsersState, fromUsersListReducer.getCompany);

export const getUserSearchTerm =
  createSelector( selectUsersState, fromUsersListReducer.getUserSearchTerm);
