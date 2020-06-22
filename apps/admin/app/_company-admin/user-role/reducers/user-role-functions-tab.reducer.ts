import * as cloneDeep from 'lodash.clonedeep';

import { SystemPermission } from 'libs/models/security/roles';
import { arraysEqual } from 'libs/core/functions';

import * as fromUserRoleFunctionTabActions from '../actions/user-role-functions-tab.action';

export interface State {
  currentPermissions: SystemPermission[];
  currentPermissionsDefaultStatus: SystemPermission[];
  disableCheckboxes: boolean;
}

export const initialState: State = {
  currentPermissions: undefined,
  currentPermissionsDefaultStatus: undefined,
  disableCheckboxes: false
};

export function reducer(state = initialState, action: fromUserRoleFunctionTabActions.FunctionTabActions): State {
  switch (action.type) {
    case fromUserRoleFunctionTabActions.UPDATE_CURRENT_ROLE_FUNCTION_TAB: {
      return action.payload ? {
        ...state,
        currentPermissions: action.payload.Permissions,
        currentPermissionsDefaultStatus: action.payload.Permissions,
        disableCheckboxes: action.payload.IsSystemRole
      } : {
          ...state,
          currentPermissions: initialState.currentPermissions,
          currentPermissionsDefaultStatus: initialState.currentPermissionsDefaultStatus
        };
    }
    case fromUserRoleFunctionTabActions.GRANT_DENY_PERMISSIONS: {
      const currPermission = action.payload;
      const newRolePermissions = cloneDeep(state.currentPermissions);

      // UI Visible = false permissions are used for feature flags and permissions we don't want users modifying outside of the manual values set on the db
      // Updating this logic keeps the hidden permissions tied to their db values regardless if the parent is/isn't checked

      if (currPermission.IsParent) {
        newRolePermissions.forEach(p => {
          if (p.SystemPermissionId === currPermission.SystemPermissionId) {
            p.IsChecked = !currPermission.IsChecked;
            if (p.ChildPermission) {
              p.ChildPermission.filter(x => x.UiVisible).forEach(cp => cp.IsChecked = !currPermission.IsChecked);
            }
            return;
          }
        });
      } else {
        newRolePermissions.forEach(p => {
          if (p.ChildPermission) {
            const visiblePermissions = p.ChildPermission.filter(x => x.UiVisible);
            const index = visiblePermissions.findIndex(f => f.SystemPermissionId === currPermission.SystemPermissionId);
            if (index > -1) {
              visiblePermissions[index].IsChecked = !currPermission.IsChecked;
            }
          }
        });
      }

      return {
        ...state,
        currentPermissions: newRolePermissions
      };
    }
    case fromUserRoleFunctionTabActions.CANCEL_PERMISSION_CHANGES: {
      return {
        ...state,
        currentPermissions: state.currentPermissionsDefaultStatus
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserRoleViewState = (state: State) => state;
export const getFunctionTabPermissions = (state: State) => state.currentPermissions;
export const getCheckedPermissions = (state: State) => getCheckedPermissionIds(state.currentPermissions);
export const getCheckboxesDisabled = (state: State) => state.disableCheckboxes;
export const getFunctionTabPendingChanges = (state: State) =>
  !(arraysEqual(getCheckedPermissionIds(state.currentPermissionsDefaultStatus), getCheckedPermissionIds(state.currentPermissions)));

function getCheckedPermissionIds(permissionCollection: SystemPermission[]): number[] {
  if (!permissionCollection) {
    return [];
  }
  const checkedIds: number[] = [];
  permissionCollection.forEach(p => {
    if (p.IsChecked) {
      checkedIds.push(p.SystemPermissionId);
      if (p.IsParent) {
        p.ChildPermission.forEach(cp => {
          if (cp.IsChecked) {
            checkedIds.push(cp.SystemPermissionId);
          }
        });
      }
    }
  });

  return checkedIds;
}
