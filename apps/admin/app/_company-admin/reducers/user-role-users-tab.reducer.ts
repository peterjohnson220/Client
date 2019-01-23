import * as cloneDeep from 'lodash.clonedeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { UserAssignedRole, UserAndRoleModel } from 'libs/models/security';

import * as fromUserRoleUserTabActions from '../actions/user-role-users-tab.action';
import {SaveButtonText} from '../constants/user-role.constants';

export interface State {
  usersAndRoles: UserAndRoleModel[];
  usersAndRolesError: string;
  activeRole: UserAssignedRole;
  usersInActiveRole: UserAndRoleModel[];
  usersNotInActiveRole: UserAndRoleModel[];
  filterTerm: string;
  saveButtonText: string;
}

export const initialState: State = {
  usersAndRoles: [],
  usersAndRolesError: '',
  activeRole: null,
  usersInActiveRole: [],
  usersNotInActiveRole: [],
  filterTerm: '',
  saveButtonText: SaveButtonText.Save
};

export function reducer(state = initialState, action: fromUserRoleUserTabActions.UserTabActions): State {
  switch (action.type) {
    case fromUserRoleUserTabActions.UPDATE_USER_TAB_CURRENT_USER_ROLE: {
      const newRole: UserAssignedRole = action.payload;
      const usersInNewRole = state.usersAndRoles
        .filter(uar => filterUsersCollectionByRole(uar, newRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      const usersNotInNewRole = state.usersAndRoles
        .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, newRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      return {
        ...state,
        activeRole: newRole,
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
      newUser.CurrentRoleId = state.activeRole.RoleId;
      newUser.IsSystemRole = state.activeRole.IsSystemRole;
      newUser.Dirty = true;

      const newUsersInRoleCollection = Object.assign([], state.usersInActiveRole);
      newUsersInRoleCollection.push(newUser);

      const usersInNewRole = newUsersInRoleCollection
        .filter(uar => filterUsersCollectionByRole(uar, state.activeRole))
        .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending));
      const usersNotInNewRole = newUsersNotInRoleCollection
        .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, state.activeRole))
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
        usersNotInActiveRole: currentSearchableUsers.filter(csu => filterUsersBySearchTerm(csu, term, state.activeRole))
      };
    }
    case fromUserRoleUserTabActions.CANCEL_CHANGES: {
      if (!state.activeRole) {
        return state;
      }

      const originalUserCollection = state.usersAndRoles;

      return {
        ...state,
        usersAndRoles: originalUserCollection,
        usersInActiveRole: originalUserCollection
          .filter(uar => filterUsersCollectionByRole(uar, state.activeRole))
          .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending)),
        usersNotInActiveRole: originalUserCollection
          .filter(uar => filterUsersBySearchTerm(uar, state.filterTerm, state.activeRole))
          .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending))
      };
    }
    case fromUserRoleUserTabActions.SET_USERS_TAB_SAVE_BUTTON_TEXT: {
      return {
        ...state,
        saveButtonText: action.payload
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
export const getUsersTabSaveButtonText = (state: State) => state.saveButtonText;

function filterUsersCollectionByRole(user: UserAndRoleModel, role: UserAssignedRole) {
  return user.CurrentRoleId === role.RoleId && user.IsSystemRole === role.IsSystemRole;
}

function filterUsersBySearchTerm(user: UserAndRoleModel, searchTerm: string, role: UserAssignedRole) {
  return (user.FirstName.toLowerCase().indexOf(searchTerm) > -1 ||
          user.LastName.toLowerCase().indexOf(searchTerm) > -1 ||
          user.UserId.toString().toLowerCase().indexOf(searchTerm) > -1) &&
          !(user.CurrentRoleId === role.RoleId && user.IsSystemRole === role.IsSystemRole);
}

