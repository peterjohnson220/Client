import * as fromDataAccessTabActions from '../actions/data-access-tab.action';
import {DataField, DataType, RoleDataRestriction} from 'libs/models/security/roles';

import {arraysEqual} from 'libs/core/functions';
import {DataFieldTypes} from '../constants/data-field-type.constants';

export interface State {
  dataTypes: DataType[];
  currentRoleDataRestrictions: RoleDataRestriction[];
  currentRoleDataRestrictionsUnchanged: RoleDataRestriction[];
}

export const initialState: State = {
  dataTypes: [],
  currentRoleDataRestrictions: [],
  currentRoleDataRestrictionsUnchanged: []
};

export function reducer(state = initialState, action: fromDataAccessTabActions.DataAccessTabAction): State {
  switch (action.type) {
    case fromDataAccessTabActions.UPDATE_CURRENT_ROLE_DATA_RESTRICTIONS: {
      return {
        ...state,
        currentRoleDataRestrictions: action.payload
      };
    }
    case fromDataAccessTabActions.UPDATE_CURRENT_ROLE_DATA_ACCESS_TAB: {
      return {
        ...state,
        currentRoleDataRestrictions: action.payload.DataRestrictions,
        currentRoleDataRestrictionsUnchanged: action.payload.DataRestrictions
      };
    }
    case fromDataAccessTabActions.SET_DATA_RESTRICTIONS_UNCHANGED: {
      return {
        ...state,
        currentRoleDataRestrictionsUnchanged: action.payload
      };
    }
    case fromDataAccessTabActions.LOADED_DATA_TYPES: {
      return {
        ...state,
        dataTypes: action.payload
      };
    }
    case fromDataAccessTabActions.CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES:
      return {
        ...state,
        currentRoleDataRestrictions: state.currentRoleDataRestrictionsUnchanged
      };
    default: {
      return state;
    }
  }
}
export const getDataTypes =  (state: State) => state.dataTypes;
export const getRoleDataRestrictions =  (state: State) => state.currentRoleDataRestrictions;
export const getDataAccessTabHasPendingChanges = (state: State) => {
 return !(arraysEqual(getRoleDataAccessString(state.currentRoleDataRestrictions),
   getRoleDataAccessString(state.currentRoleDataRestrictionsUnchanged)));
};

function getRoleDataAccessString(roleDataPermissions: RoleDataRestriction[]) {
  return roleDataPermissions ? roleDataPermissions.map(r => `${r.DataFieldId}_${r.DataConditionIsEqual}_${r.DataValue}`) : [];
}
