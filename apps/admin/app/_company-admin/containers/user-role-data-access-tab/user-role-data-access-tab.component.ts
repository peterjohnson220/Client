import {Component, OnInit, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';

import {DataField, RoleDataRestriction, DataType } from 'libs/models/security/roles';

import * as fromDataAccessTabReducer from '../../reducers';
import {Subscription} from 'rxjs';

import * as fromRoleDataTabActions from '../../actions/data-access-tab.action';

import {DataFieldTypes} from '../../constants/data-field-type.constants';

@Component({
  selector: 'pf-user-role-data-access-tab',
  templateUrl: './user-role-data-access-tab.component.html',
  styleUrls: ['./user-role-data-access-tab.component.scss']
})
export class UserRoleDataAccessTabComponent  implements OnDestroy {
  dataTypes: DataType[];
  dataFields: DataField[];
  roleDataRestrictions: RoleDataRestriction[];
  defaultRoleDataRestrictions: RoleDataRestriction[];
  currentRoleId: number;
  dataTypesSubscription: Subscription;
  roleDataRestrictionSubscription: Subscription;
  constructor(public store: Store<fromDataAccessTabReducer.State>) {
    this.defaultRoleDataRestrictions = [];
    this.dataTypesSubscription = this.store.select(fromDataAccessTabReducer.getDataTypes).subscribe(p => {
      this.dataTypes = p;
      (this.dataTypes || []).forEach(dt => {
        const rdr = new RoleDataRestriction();
        rdr.DataFieldId = dt.DataFields[0].Id;
        this.defaultRoleDataRestrictions.push(rdr);
        this.dataFields = (this.dataFields || []).concat(dt.DataFields);
      });
      this.store.dispatch(new fromRoleDataTabActions.UpdateCurrentRoleDataRestrictions(this.defaultRoleDataRestrictions));
    });

    this.roleDataRestrictionSubscription = this.store.select(fromDataAccessTabReducer.getCurrentUserRole).subscribe(ur => {
      if (ur) {
        this.currentRoleId = ur.RoleId;
        this.store.dispatch(new fromRoleDataTabActions.SaveOriginalRoleDataRestrictions( ur.DataRestrictions));
        this.initRoleDataRestriction(ur.DataRestrictions);
      }
    });
  }

  roleDataRestrictionChanged() {
    const newRoleDataRestrictions = [];
    this.roleDataRestrictions.filter(f => f.DataFieldId && f.DataConditionIsEqual && f.DataValue).forEach(r => {
        if (this.dataFields.find(df => df.Id === r.DataFieldId).FieldType === DataFieldTypes.REFERENCE) {
          r.DataValue.forEach(dv => {
            newRoleDataRestrictions.push(
              {DataFieldId: r.DataFieldId,
                DataConditionIsEqual: r.DataConditionIsEqual,
                DataValue: dv.toString(),
                RoleId : this.currentRoleId});

          });
        } else {
          newRoleDataRestrictions.push( {DataFieldId: r.DataFieldId,
            DataConditionIsEqual: r.DataConditionIsEqual,
            DataValue: r.DataValue.toString(),
            RoleId : this.currentRoleId});
        }
      });
    this.store.dispatch(new fromRoleDataTabActions.UpdateCurrentRoleDataRestrictions(newRoleDataRestrictions));
  }
  ngOnDestroy() {
    this.dataTypesSubscription.unsubscribe();
  }

  initRoleDataRestriction(dataRestrictions: RoleDataRestriction[]) {
    this.roleDataRestrictions = [];
    this.dataFields.forEach(df => {
      switch (df.FieldType) {
        case DataFieldTypes.REFERENCE:
          const tempRd = dataRestrictions.filter(dr => dr.DataFieldId === df.Id);
          if (tempRd.length !== 0) {
            this.roleDataRestrictions.push({...tempRd[0], DataValue: tempRd.map(t => t.DataValue)});
          }
          break;
        default:
          this.roleDataRestrictions = this.roleDataRestrictions
            .concat(dataRestrictions.filter(dr => dr.DataFieldId === df.Id).map( dr => ({...dr})));
          break;
      }
    });
    this.dataTypes.forEach(dt => {
      const rd = this.roleDataRestrictions.find(r => dt.DataFields.map(m => m.Id).indexOf(r.DataFieldId) > -1);
      if (!rd) {
        this.roleDataRestrictions.push(
          {...this.defaultRoleDataRestrictions.find(f => dt.DataFields.map(m => m.Id).indexOf(f.DataFieldId) > -1)});
      }
    });
  }
}
