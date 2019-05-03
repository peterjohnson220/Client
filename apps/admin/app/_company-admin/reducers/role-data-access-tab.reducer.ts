import * as fromDataAccessTabActions from '../actions/data-access-tab.action';
import {DataField, DataType, RoleDataRestriction} from 'libs/models/security/roles';

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
    case fromDataAccessTabActions.LOADED_DATA_TYPES:
      return {
        ...state,
        dataTypes: action.payload
      };
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
// TODO remove when API returns paymarket Ids as string and user 'getRoleDataRestrictions'
export const getRoleDataRestrictionsToSave = (state: State) => RemapRoleDataRestrictions(state.currentRoleDataRestrictions);
export const getDataAccessTabHasPendingChanges = (state: State) => {
 return !(arraysEqual(getRoleDataAccessString(state.currentRoleDataRestrictions),
   getRoleDataAccessString(state.currentRoleDataRestrictionsUnchanged)));
};


// TODO remove when API returns paymarket Ids as string
function RemapRoleDataRestrictions(dataRestrictions: RoleDataRestriction[]) {
  if (!dataRestrictions || dataRestrictions.length === 0) {
    return [];
  }
  return dataRestrictions.map(rd => ({
    DataFieldId : rd.DataFieldId,
    RoleId: rd.RoleId,
    DataConditionIsEqual: rd.DataConditionIsEqual,
    DataValue: (rd.DataValue || '').toString()
  }));
}

function getRoleDataAccessString(roleDataPermissions: RoleDataRestriction[]) {
  return roleDataPermissions ? roleDataPermissions.map(r => `${r.DataFieldId}_${r.DataConditionIsEqual}_${r.DataValue}`) : [];
}
