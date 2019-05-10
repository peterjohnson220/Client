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
  let changed = false;
  const stringCurrentRoleDataRestrictionsUnchanged = getRoleDataAccessString(state.currentRoleDataRestrictionsUnchanged);
  getRoleDataAccessString(state.currentRoleDataRestrictions).forEach( f => {
    if (!stringCurrentRoleDataRestrictionsUnchanged.find(uch => uch === f)) {
      changed = true;
      return;
    }
  });
  return changed;
};

function getRoleDataAccessString(roleDataPermissions: RoleDataRestriction[]) {
  return roleDataPermissions ? roleDataPermissions
    .filter(f => f.DataValue && f.DataConditionIsEqual && f.DataFieldId)
    .map(r => `${r.DataFieldId}_${r.DataConditionIsEqual}_${r.DataValue}`) : [];
}
