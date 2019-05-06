import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {DataField, RoleDataRestriction, DataType } from 'libs/models/security/roles';

import * as userRoleReducer from '../../reducers';
import * as fromRoleDataTabActions from '../../actions/data-access-tab.action';
import {DataAccessService} from '../../services/data-access.service';


@Component({
  selector: 'pf-user-role-data-access-tab',
  templateUrl: './user-role-data-access-tab.component.html',
  styleUrls: ['./user-role-data-access-tab.component.scss']
})
export class UserRoleDataAccessTabComponent  implements OnDestroy {
  dataTypes: DataType[] = [];
  dataFields: DataField[] = [];
  roleDataRestrictions: RoleDataRestriction[] = [];
  currentRoleId: number;
  dataTypesSubscription: Subscription;
  roleDataRestrictionSubscription: Subscription;
  currentUserRoleSubscription: Subscription
  constructor(public store: Store<userRoleReducer.State>, public dataAccessService: DataAccessService) {
    this.dataTypesSubscription = this.store.select(userRoleReducer.getDataTypes).subscribe(p => {
      this.dataTypes = p || [];
      (this.dataTypes).forEach(dt => {
        this.dataFields = this.dataFields.concat(dt.DataFields);
      });
    });

    this.roleDataRestrictionSubscription = this.store.select(userRoleReducer.getRoleDataRestrictions).subscribe(rd => {
      if (rd) {
        const withBlankRows = dataAccessService.createBlankDataRestrictionIfNeeded(this.dataTypes, rd);
        this.roleDataRestrictions = dataAccessService.ConvertRoleDataRestrictionForUI(this.dataFields, withBlankRows);
      }
    });
    this.currentUserRoleSubscription = this.store.select(userRoleReducer.getCurrentUserRole).subscribe(ur => {
      if (ur) {
        this.currentRoleId = ur.RoleId;
      }
    });
  }

  roleDataRestrictionChanged() {
    const convertedDataRoles = this.dataAccessService.ConvertRoleDataRestrictionForStore(
      this.dataFields,
      this.roleDataRestrictions,
      this.currentRoleId);
    this.store.dispatch(new fromRoleDataTabActions.UpdateCurrentRoleDataRestrictions(convertedDataRoles));
  }
  ngOnDestroy() {
    this.dataTypesSubscription.unsubscribe();
    this.currentUserRoleSubscription.unsubscribe();
    this.roleDataRestrictionSubscription.unsubscribe();
  }
}
