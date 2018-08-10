import * as fromUserAssignedRoleActions from '../actions/user-assigned-roles.actions';
import {UserAssignedRole} from '../../../models/security/index';

export interface State {
  loading: boolean;
  loadingError: boolean;
  gettingUserAssignedRolesAttempted: boolean;
  userAssignedRoles: UserAssignedRole[];
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  gettingUserAssignedRolesAttempted: false,
  userAssignedRoles: null
};

export function reducer(
  state = initialState,
  action: fromUserAssignedRoleActions.Actions
): State {
  switch (action.type) {
    case fromUserAssignedRoleActions.GET_USER_ASSIGNED_ROLES: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        userAssignedRoles: null
      };
    }
    case fromUserAssignedRoleActions.GET_USER_ASSIGNED_ROLES_SUCCESS: {
      return {
        ...state,
        loading: false,
        gettingUserAssignedRolesAttempted: true,
        userAssignedRoles: action.payload
      };
    }
    case fromUserAssignedRoleActions.GET_USER_ASSIGNED_ROLES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true,
        gettingUserAssignedRolesAttempted: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getUserAssignedRolesAttempted = (state: State) => state.gettingUserAssignedRolesAttempted;
export const getUserAssignedRoles = (state: State) => state.userAssignedRoles;
