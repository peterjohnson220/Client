import cloneDeep from 'lodash/cloneDeep';

import { DataField, DataType, RoleDataRestriction } from 'libs/models/security/roles';

import { DataFieldTypes } from '../constants/data-field-type.constants';
import * as fromDataAccessTabActions from '../actions/data-access-tab.action';

export interface State {
  currentRoleId: number;
  dataTypes: DataType[];
  dataFields: DataField[];
  currentRoleDataRestrictions: RoleDataRestriction[];
  currentRoleDataRestrictionsUnchanged: RoleDataRestriction[];
}

export const initialState: State = {
  currentRoleId: 0,
  dataTypes: [],
  dataFields: [],
  currentRoleDataRestrictions: [],
  currentRoleDataRestrictionsUnchanged: []
};

export function reducer(state = initialState, action: fromDataAccessTabActions.DataAccessTabAction): State {
  switch (action.type) {
    case fromDataAccessTabActions.LOADED_DATA_TYPES: {
      let dataFields = [];
      (action.payload).forEach(dt => {
        dataFields = dataFields.concat(dt.DataFields);
      });
      return {
        ...state,
        dataTypes: action.payload,
        dataFields: dataFields
      };
    }
    case fromDataAccessTabActions.CANCEL_ROLE_DATA_RESTRICTIONS_CHANGES:
      return {
        ...state,
        currentRoleDataRestrictions: cloneDeep(state.currentRoleDataRestrictionsUnchanged
          .map(dr => ({ ...dr, Id: new Date().getUTCMilliseconds() + dr.Id })))
      };
    case fromDataAccessTabActions.ADD_NEW_DATA_RESTRICTION: {
      const dataFieldId = state.dataFields.find(dt => dt.DataTypeId === action.dataType.Id).Id;
      const dataRestriction = {
        Id: new Date().getUTCMilliseconds(),
        RoleId: state.currentRoleId,
        DataFieldId: dataFieldId,
        DataValue: null,
        DataConditionIsEqual: undefined
      };
      return Object.assign({}, state, {
        currentRoleDataRestrictions: [...state.currentRoleDataRestrictions, dataRestriction]
      });
    }
    case fromDataAccessTabActions.REMOVE_DATA_RESTRICTION: {
      const dataRestrictions = [...state.currentRoleDataRestrictions];
      const index = state.currentRoleDataRestrictions.indexOf(action.dataRestriction);
      dataRestrictions.splice(index, 1);
      return {
        ...state,
        currentRoleDataRestrictions: dataRestrictions
      };
    }
    case fromDataAccessTabActions.UPDATE_SINGLE_DATA_RESTRICTION: {
      const dataRestrictions = [...state.currentRoleDataRestrictions];
      const index = state.currentRoleDataRestrictions.indexOf(action.dataRestriction);
      const dataRestriction = { ...state.currentRoleDataRestrictions[index] };
      dataRestriction[action.property] = action.value;
      dataRestrictions[index] = dataRestriction;
      return {
        ...state,
        currentRoleDataRestrictions: dataRestrictions
      };
    }
    case fromDataAccessTabActions.UPDATE_CURRENT_ROLE: {
      if (!action.payload) {
        return {
          ...state,
          currentRoleDataRestrictions: initialState.currentRoleDataRestrictions,
          currentRoleDataRestrictionsUnchanged: initialState.currentRoleDataRestrictionsUnchanged,
          currentRoleId: initialState.currentRoleId
        };
      }
      const withBlankRows = createBlankDataRestrictionIfNeeded(state.dataTypes, action.payload.DataRestrictions);
      const dataRestrictions = convertRoleDataRestrictionForUI(state.dataFields, withBlankRows);
      return {
        ...state,
        currentRoleDataRestrictions: dataRestrictions,
        currentRoleDataRestrictionsUnchanged: dataRestrictions.map(dr => ({ ...dr, Id: new Date().getUTCMilliseconds() + dr.Id })),
        currentRoleId: action.payload.RoleId
      };
    }
    default: {
      return state;
    }
  }
}
export const getDataTypes = (state: State) => state.dataTypes;

export const getRoleDataRestrictions = (state: State) => state.currentRoleDataRestrictions;

export const getRoleDataRestrictionsForSave = (state: State) =>
  convertRoleDataRestrictionForSave(state.dataFields, state.currentRoleDataRestrictions, state.currentRoleId, state.dataTypes);

export const getDataAccessTabHasPendingChanges = (state: State) => {
  let changed = false;
  const stringCurrentRoleDataRestrictionsUnchanged = getRoleDataAccessString(state.currentRoleDataRestrictionsUnchanged);
  getRoleDataAccessString(state.currentRoleDataRestrictions).forEach(f => {
    if (!stringCurrentRoleDataRestrictionsUnchanged.find(uch => uch === f)) {
      changed = true;
      return;
    }
  });
  return changed;
};

function getRoleDataAccessString(roleDataPermissions: RoleDataRestriction[]) {
  return roleDataPermissions ? roleDataPermissions
    .map(r => `${r.DataFieldId}_${r.DataConditionIsEqual}_${r.DataValue}`) : [];
}

function createBlankDataRestrictionIfNeeded(dataTypes: DataType[], roleDataRestrictions: RoleDataRestriction[]) {
  const dataRestrictions = [];
  dataTypes.forEach(dt => {
    const rd = roleDataRestrictions.find(r => dt.DataFields.map(m => m.Id).indexOf(r.DataFieldId) > -1);
    if (!rd) {
      dataRestrictions.push({ Id: new Date().getUTCMilliseconds(), DataFieldId: dt.DataFields[0].Id, DataConditionIsEqual: true });
    }
  });
  return dataRestrictions.concat(roleDataRestrictions);
}

function convertRoleDataRestrictionForUI(dataFields: DataField[], roleDataRestrictions: RoleDataRestriction[]) {
  let dataRestrictions = [];

  dataFields.forEach(df => {
    const tempRd = roleDataRestrictions.filter(dr => dr.DataFieldId === df.Id);
    if (tempRd && tempRd.length !== 0) {
      switch (df.FieldType) {
        case DataFieldTypes.MULTISELECT:
        case DataFieldTypes.CONDITIONAL_MULTISELECT:
          dataRestrictions.push({ ...tempRd[0], Id: new Date().getUTCMilliseconds(), DataValue: tempRd.map(t => t.DataValue) });
          break;
        default:
          dataRestrictions = dataRestrictions.concat(tempRd.map(dr => ({ ...dr })));
          break;
      }
    }
  });

  return dataRestrictions;
}


function convertRoleDataRestrictionForSave(dataFields: DataField[], dataRestrictions: RoleDataRestriction[], roleId: number, dataTypes: DataType[]) {
  const newRoleDataRestrictions = [];
  dataRestrictions.filter(f => f.DataFieldId).forEach(r => {
    const dataField = dataFields.find(df => df.Id === r.DataFieldId);
    if (dataField.FieldType === DataFieldTypes.MULTISELECT || dataField.FieldType === DataFieldTypes.CONDITIONAL_MULTISELECT) {
      r.DataValue.forEach(dv => {
        newRoleDataRestrictions.push({
          DataFieldId: r.DataFieldId,
          RoleId: roleId,
          DataConditionIsEqual: r.DataConditionIsEqual,
          DataValue: dv
        });

      });
    } else {
      newRoleDataRestrictions.push({
        DataFieldId: r.DataFieldId,
        RoleId: roleId,
        DataConditionIsEqual: r.DataConditionIsEqual,
        DataValue: isJobsUdfOrJobFamily(dataField, dataTypes) && r.DataValue === '' ? '(Blank)' : r.DataValue
      });
    }
  });
  return newRoleDataRestrictions;
}

function isJobsUdfOrJobFamily(dataField: DataField, dataTypes: DataType[]): boolean {
  const isJobsDataType = dataTypes.find(dt => dt.Name === 'Jobs').DataFields.includes(dataField);

  return (dataField.Name.includes('UDF_CHAR') && isJobsDataType) || dataField.Name === 'Job_Family';
}
