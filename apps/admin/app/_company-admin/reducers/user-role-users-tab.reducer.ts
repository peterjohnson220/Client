import * as cloneDeep from 'lodash.clonedeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { UserAndRoleModel } from 'libs/models/security/roles';

import * as fromUserRoleUserTabActions from '../actions/user-role-users-tab.action';

export interface State {
  usersAndRoles: UserAndRoleModel[];
  usersAndRolesError: string;
  activeRoleId: number;
  activeRoleIsSystemRole: boolean;
  usersInActiveRole: UserAndRoleModel[];
  usersNotInActiveRole: UserAndRoleModel[];
  filterTerm: string;
}

export const initialState: State = {
  usersAndRoles: [],
  usersAndRolesError: '',
  activeRoleId: null,
  activeRoleIsSystemRole: false,
  usersInActiveRole: [],
  usersNotInActiveRole: [],
  filterTerm: ''
};

export function reducer(state = initialState, action: fromUserRoleUserTabActions.UserTabActions): State {
  switch (action.type) {
    case fromUserRoleUserTabActions.UPDATE_CURRENT_USER_ROLE_USER_TAB: {
      const newRoleId = action.payload.NewRoleId;
      const newRoleIsSystemRole = action.payload.NewRoleIsSystemRole;
      const usersInNewRole = state.usersAndRoles
        .filter(uar => filterUsersCollectionByRole(uar, newRoleId, newRoleIsSystemRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      const usersNotInNewRole = state.usersAndRoles
        .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, newRoleId, newRoleIsSystemRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      return {
        ...state,
        activeRoleId: newRoleId,
        activeRoleIsSystemRole: newRoleIsSystemRole,
        usersInActiveRole: usersInNewRole,
        usersNotInActiveRole: usersNotInNewRole
      };
    }
    case fromUserRoleUserTabActions.GET_USERS_AND_ROLES: {
      return {
        ...state,
        usersAndRolesError: null
      };
    }
    case fromUserRoleUserTabActions.GET_USERS_AND_ROLES_SUCCESS: {
      return {
        ...state,
        usersAndRoles: action.payload
      };
    }
    case fromUserRoleUserTabActions.ADD_USER_TO_ROLE: {
      const existingUser = state.usersNotInActiveRole.find(u => u.UserId === action.payload.UserId);
      const newUsersNotInRoleCollection = state.usersNotInActiveRole.filter(uar => {
        return uar !== existingUser;
      });

      const newUser: UserAndRoleModel = cloneDeep(existingUser);
      newUser.PreviousRoleId = existingUser.CurrentRoleId;
      newUser.CurrentRoleId = state.activeRoleId;
      newUser.IsSystemRole = state.activeRoleIsSystemRole;
      newUser.Dirty = true;

      const newUsersInRoleCollection = Object.assign([], state.usersInActiveRole);
      newUsersInRoleCollection.push(newUser);

      const usersInNewRole = newUsersInRoleCollection
        .filter(uar => filterUsersCollectionByRole(uar, state.activeRoleId, state.activeRoleIsSystemRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      const usersNotInNewRole = newUsersNotInRoleCollection
        .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, state.activeRoleId, state.activeRoleIsSystemRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      return {
        ...state,
        usersInActiveRole: usersInNewRole,
        usersNotInActiveRole: usersNotInNewRole
      };
    }
    case fromUserRoleUserTabActions.FILTER_USERS_COLLECTION: {
      const currentSearchableUsers = state.usersAndRoles;
      const term = action.payload.toString().toLowerCase();
      return {
        ...state,
        filterTerm: term,
        usersNotInActiveRole: currentSearchableUsers.filter(csu =>
          filterUsersBySearchTerm(csu, term, state.activeRoleId, state.activeRoleIsSystemRole))
      };
    }
    case fromUserRoleUserTabActions.CANCEL_CHANGES: {
      if (!state.activeRoleId) {
        return state;
      }

      const originalUserCollection = state.usersAndRoles;

      return {
        ...state,
        usersAndRoles: originalUserCollection,
        usersInActiveRole: originalUserCollection
          .filter(uar => filterUsersCollectionByRole(uar, state.activeRoleId, state.activeRoleIsSystemRole))
          .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending)),
        usersNotInActiveRole: originalUserCollection
          .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, state.activeRoleId, state.activeRoleIsSystemRole))
          .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending))
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserRoleUserTabState = (state: State) => state;
export const getUsersAndRoles = (state: State) => state.usersAndRoles;
export const getUsersAndRolesError = (state: State) => state.usersAndRolesError;
export const getUsersInActiveRole = (state: State) => state.usersInActiveRole;
export const getUsersNotInActiveRole = (state: State) => state.usersNotInActiveRole;
export const getUsersTabHasPendingChanges = (state: State) => state.usersInActiveRole.some(u => u.Dirty);
export const getUserIdsToSave = (state: State) => state.usersInActiveRole.filter(u => u.Dirty).map(u => u.UserId);

function filterUsersCollectionByRole(user: UserAndRoleModel, roleId: number, isSystemRole: boolean) {
  return user.CurrentRoleId === roleId && user.IsSystemRole === isSystemRole;
}

function filterUsersBySearchTerm(user: UserAndRoleModel, searchTerm: string, roleId: number, isSystemRole: boolean) {
  return (user.FirstName.toLowerCase().indexOf(searchTerm) > -1 ||
          user.LastName.toLowerCase().indexOf(searchTerm) > -1 ||
          user.UserId.toString().toLowerCase().indexOf(searchTerm) > -1) &&
          !(user.CurrentRoleId === roleId && user.IsSystemRole === isSystemRole);
}
