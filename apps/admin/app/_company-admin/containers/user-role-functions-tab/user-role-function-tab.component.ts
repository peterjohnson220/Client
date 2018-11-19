import {Component, Input, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {UserAssignedRole, CompanyRolePermission} from 'libs/models/security';

import {CompanyRolePermissionService} from '../../services';
import * as fromUserRoleViewReducer from '../../reducers';

@Component({
  selector: 'pf-user-role-function-tab',
  templateUrl: './user-role-function-tab.component.html',
  styleUrls: ['user-role-function-tab.component.scss']
})
export class UserRoleFunctionTabComponent implements OnDestroy {
  saveButtonText: string;
  currentRoleSubscription: Subscription;
  currentRole: UserAssignedRole;
  constructor(public store: Store<fromUserRoleViewReducer.State>,
              public companyRolePermissionService: CompanyRolePermissionService) {
    this.store.select(fromUserRoleViewReducer.getFunctionSaveButtonText).subscribe(text => {
      this.saveButtonText = text;
    });
    this.currentRoleSubscription = this.store.select(fromUserRoleViewReducer.getCurrentUserRole).subscribe(userRole => {
      if (!this.currentRole || this.currentRole.DerivedId !== userRole.DerivedId) {
        this.companyRolePermissionService.getCompanyRolePermissions(userRole);
      }
      this.currentRole = userRole;
    });
  }

  handleSaveClicked() {
    this.companyRolePermissionService.updateCompanyRolePermissions(this.currentRole);
  }
  handleCheckBoxCheck(currentPermission: any) {
    this.companyRolePermissionService.setChildPermissions(this.currentRole, currentPermission);
  }
  ngOnDestroy() {
    this.currentRoleSubscription.unsubscribe();

  }
}
