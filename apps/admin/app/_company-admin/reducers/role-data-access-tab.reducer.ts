import * as fromDataAccessTabActions from '../actions/data-access-tab.action';
import {DataType, RoleDataRestriction} from 'libs/models/security/roles';

import {arraysEqual} from 'libs/core/functions';

export interface State {
  dataTypes: DataType[];
  currentRoleDataRestrictions: RoleDataRestriction[];
  currentRoleDataRestrictionsUnchanged: RoleDataRestriction[];
}

export const initialState: State = {
  dataTypes: undefined,
  currentRoleDataRestrictions: undefined,
  currentRoleDataRestrictionsUnchanged: undefined
};

export function reducer(state = initialState, action: fromDataAccessTabActions.DataAccessTabAction): State {
  switch (action.type) {
    case fromDataAccessTabActions.UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS: {
      return {
        ...state,
        currentRoleDataRestrictions: action.payload.map( r => ({ DataFieldId: r.DataFieldId,
          RoleId: r.RoleId,
          DataConditionIsEqual: r.DataConditionIsEqual,
          DataValue: r.DataValue}))
      };
    }
    case fromDataAccessTabActions.SAVE_ORIGINAL_ROLE_DATA_RESTRICTIONS: {
      return {
        ...state,
        currentRoleDataRestrictionsUnchanged: action.payload
      };
    }
    case fromDataAccessTabActions.LOADED_DATA_TYPES:
      return {
        ...state,
        dataTypes: action.payload
      };
    case fromDataAccessTabActions.CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES:
      return {
        ...state,
        currentRoleDataRestrictions: state.currentRoleDataRestrictionsUnchanged.map( r => ({...r}))
      };
    default: {
      return state;
    }
  }
}
export const getDataTypes =  (state: State) => state.dataTypes;
export const getRoleDataRestrictions =  (state: State) => state.currentRoleDataRestrictions;
export const getDataAccessTabHasPendingChanges = (state: State) => {
 return !(arraysEqual(getRoleDataPermissionString(state.currentRoleDataRestrictions),
   getRoleDataPermissionString(state.currentRoleDataRestrictionsUnchanged)));
};

function getRoleDataPermissionString(roleDataPermissions: RoleDataRestriction[]) {
  return roleDataPermissions ? roleDataPermissions.map(r => `${r.DataFieldId}_${r.DataConditionIsEqual}_${r.DataValue}'`) : [];
}
