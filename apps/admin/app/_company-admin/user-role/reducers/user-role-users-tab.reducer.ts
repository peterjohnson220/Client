import cloneDeep from 'lodash/cloneDeep';

import { arraySortByString, SortDirection } from 'libs/core/functions';
import { UserAndRoleModel, UserAssignedRole } from 'libs/models/security/roles';

import * as fromUserRoleUserTabActions from '../actions/user-role-users-tab.action';

export interface State {
  users: UserAndRoleModel[];
  originalUsers: UserAndRoleModel[];
  activeRole: UserAssignedRole;
  filterTerm: string;
}

export const initialState: State = {
  users: [],
  originalUsers: [],
  activeRole: null,
  filterTerm: ''
};

export function reducer(state = initialState, action: fromUserRoleUserTabActions.UserTabActions): State {
  switch (action.type) {
    case fromUserRoleUserTabActions.UPDATE_CURRENT_USER_ROLE_USER_TAB: {
      const newRole = action.payload;
      return {
        ...state,
        activeRole: newRole,
      };
    }
    case fromUserRoleUserTabActions.GET_USERS_AND_ROLES: {
      return {
        ...state,
      };
    }
    case fromUserRoleUserTabActions.GET_USERS_AND_ROLES_SUCCESS: {
      return {
        ...state,
        users: Object.assign([], action.payload),
        originalUsers: Object.assign([], action.payload)
      };
    }
    case fromUserRoleUserTabActions.ADD_USER_TO_ROLE: {
      let updatedUsers = Object.assign([], state.users);
      const userToUpdate = cloneDeep(updatedUsers.find(u => u.UserId === action.payload.UserId));
      userToUpdate.CurrentRoleId = state.activeRole.RoleId;
      userToUpdate.RoleName = state.activeRole.RoleName;
      userToUpdate.Dirty = true;

      updatedUsers = updatedUsers.filter(u => u.UserId !== userToUpdate.UserId);
      updatedUsers.push(userToUpdate);

      return {
        ...state,
        users: updatedUsers
      };
    }
    case fromUserRoleUserTabActions.FILTER_USERS_COLLECTION: {
      return {
        ...state,
        filterTerm: action.payload.toString().toLowerCase(),
      };
    }
    case fromUserRoleUserTabActions.CANCEL_CHANGES: {
      if (!state.activeRole) {
        return state;
      }

      return {
        ...state,
        users: Object.assign([], state.originalUsers)
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserRoleUserTabState = (state: State) => state;
export const getUsersAndRoles = (state: State) => state.users;
export const getUsersInActiveRole = (state: State) => getUsersInRole(state);
export const getUsersNotInActiveRole = (state: State) => getUsersNotInRole(state);
export const getUsersTabHasPendingChanges = (state: State) => state.users.some(u => u.Dirty);
export const getUserIdsToSave = (state: State) => state.users.filter(u => u.Dirty).map(u => u.UserId);

function getUsersInRole(state: State) {
  return state.activeRole ? state.users
    .filter(user => user.CurrentRoleId === state.activeRole.RoleId)
    .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending)) : [];
}

function getUsersNotInRole(state: State) {
  return state.activeRole ? state.users
    .filter(user =>
      (user.FirstName.toLowerCase().indexOf(state.filterTerm) > -1
        || user.LastName.toLowerCase().indexOf(state.filterTerm) > -1
        || user.UserId.toString().toLowerCase().indexOf(state.filterTerm) > -1
      ) && user.CurrentRoleId !== state.activeRole.RoleId
    )
    .sort((a, b) => arraySortByString(a.LastName, b.LastName, SortDirection.Ascending)) : [];
}
