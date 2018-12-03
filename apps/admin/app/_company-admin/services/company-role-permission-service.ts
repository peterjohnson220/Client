import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import {CompanyRolePermission, UserAssignedRole} from 'libs/models/security';
import {CompanyAdminApiService} from 'libs/data/payfactors-api/company-admin';

import * as fromUserRoleViewReducer from '../reducers';
import * as fromUserRoleViewActions from '../actions';
import {SaveButtonText} from '../constants/user-role.constants';

@Injectable()
export class CompanyRolePermissionService {
  constructor(private store: Store<fromUserRoleViewReducer.State>,
              private companyAdminApi: CompanyAdminApiService) {
  }

  getCompanyRolePermissions(role: UserAssignedRole) {
    if ( role ) {
      this.companyAdminApi.getCompanyRolePermissions(role.DerivedId).subscribe(
        permissions => {
          return this.store.dispatch(new  fromUserRoleViewActions.UpdateCurrentUserRole({
            DerivedId : role.DerivedId,
            Permissions: permissions,
            Assigned : role.Assigned,
            RoleName : role.RoleName,
            RoleType: role.RoleType
          } as UserAssignedRole));
        }
      );
    }
  }

  updateCompanyRolePermissions(role: UserAssignedRole) {
    this.store.dispatch(new fromUserRoleViewActions.SetFunctionTabSaveButtonText(SaveButtonText.Saving));
    const systemPermissionIds = [];
    role.Permissions.filter(value => value.IsChecked).forEach(
      value => systemPermissionIds.push( value.Id )
  );
    this.companyAdminApi.updateCompanyRolePermissions(role.DerivedId, systemPermissionIds).subscribe(() => {
      this.store.dispatch(new fromUserRoleViewActions.SetFunctionTabSaveButtonText(SaveButtonText.Success));
      setTimeout(() => {
        this.store.dispatch(new fromUserRoleViewActions.SetFunctionTabSaveButtonText(SaveButtonText.Save)); },
        2000);
    });
      return this.store.dispatch(new fromUserRoleViewActions.UpdateCompanyRolePermissions(role));
  }

  setChildPermissions(role: UserAssignedRole, currPermission: CompanyRolePermission) {
    const newRole = JSON.parse(JSON.stringify(role));
    if (currPermission.IsParent ) {
      newRole.Permissions.filter(value => value.FeatureAreaId === currPermission.FeatureAreaId)
        .forEach(value => value.IsChecked = !currPermission.IsChecked);
    } else {
      newRole.Permissions.filter(value => value.Id === currPermission.Id)
        .forEach(value => value.IsChecked = !currPermission.IsChecked);
    }
    return this.store.dispatch(new  fromUserRoleViewActions.UpdateCurrentUserRole(newRole));
  }
}
