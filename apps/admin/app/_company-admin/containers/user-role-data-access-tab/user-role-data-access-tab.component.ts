import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DataType, RoleDataRestriction, UserAssignedRole } from 'libs/models/security/roles';
import * as fromRoleDataTabActions from '../../actions/data-access-tab.action';
import * as userRoleReducer from '../../reducers';

@Component({
  selector: 'pf-user-role-data-access-tab',
  templateUrl: './user-role-data-access-tab.component.html',
  styleUrls: ['./user-role-data-access-tab.component.scss']
})
export class UserRoleDataAccessTabComponent {
  dataTypes$: Observable<DataType[]>;
  roleDataRestrictions$: Observable<RoleDataRestriction[]>;
  currentRole$: Observable<UserAssignedRole>;

  constructor(public store: Store<userRoleReducer.State>) {
    this.dataTypes$ = this.store.select(userRoleReducer.getDataTypes);
    this.roleDataRestrictions$ = this.store.select(userRoleReducer.getRoleDataRestrictions);
    this.currentRole$ = this.store.select(userRoleReducer.getCurrentUserRole);
  }

  roleDataRestrictionChanged(dataRestriction: RoleDataRestriction, property: string, value: any) {
    this.store.dispatch(new fromRoleDataTabActions.UpdateSingleDataRestriction(dataRestriction, property, value));
  }

  removeDataRestriction(dataRestriction: RoleDataRestriction) {
    this.store.dispatch(new fromRoleDataTabActions.RemoveDataRestriction(dataRestriction));
  }

  addDataRestriction(dataType: DataType) {
    this.store.dispatch(new fromRoleDataTabActions.AddNewDataRestriction(dataType));
  }
  trackByFn(index, item: RoleDataRestriction) {
    return item.Id;
  }
}
