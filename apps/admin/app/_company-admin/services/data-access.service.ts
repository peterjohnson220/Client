import {Injectable} from '@angular/core';

import {DataField, DataType, RoleDataRestriction} from 'libs/models/security/roles';
import {DataFieldTypes} from '../constants/data-field-type.constants';

@Injectable()
export class DataAccessService {
  constructor() {  }

  createBlankDataRestrictionIfNeeded(dataTypes: DataType[] , roleDataRestrictions: RoleDataRestriction[]) {
    const dataRestrictions = [];
    dataTypes.forEach(dt => {
      const rd = roleDataRestrictions.find(r => dt.DataFields.map(m => m.Id).indexOf(r.DataFieldId) > -1);
      if (!rd) {
        dataRestrictions.push({ DataFieldId : dt.DataFields[0].Id });
      }
    });
    return dataRestrictions.concat(roleDataRestrictions);
  }

  ConvertRoleDataRestrictionForUI(dataFields: DataField[] , roleDataRestrictions: RoleDataRestriction[]) {
    let dataRestrictions = [];

    dataFields.forEach(df => {
      const tempRd = roleDataRestrictions.filter(dr => dr.DataFieldId === df.Id);
      if (tempRd && tempRd.length !== 0) {
        switch (df.FieldType) {
          case DataFieldTypes.MULTISELECT:
            dataRestrictions.push({...tempRd[0], DataValue: tempRd.map(t => t.DataValue)});
            break;
         default:
            dataRestrictions = dataRestrictions.concat(tempRd.map(dr => ({...dr})));
            break;
        }
      }
    });

    return dataRestrictions;
  }


  ConvertRoleDataRestrictionForStore(dataFields: DataField[], dataRestrictions: RoleDataRestriction[], roleId: number) {
    const newRoleDataRestrictions = [];
    dataRestrictions.filter(f => f.DataFieldId).forEach(r => {
      if (dataFields.find(df => df.Id === r.DataFieldId).FieldType === DataFieldTypes.MULTISELECT) {
        r.DataValue.forEach(dv => {
          newRoleDataRestrictions.push({
            DataFieldId: r.DataFieldId,
            RoleId : roleId,
            DataConditionIsEqual: r.DataConditionIsEqual,
            DataValue: dv
            });

        });
      } else {
        newRoleDataRestrictions.push({
          DataFieldId: r.DataFieldId,
          RoleId : roleId,
          DataConditionIsEqual: r.DataConditionIsEqual,
          DataValue: r.DataValue
        });
      }
    });
    return newRoleDataRestrictions;
  }
}
