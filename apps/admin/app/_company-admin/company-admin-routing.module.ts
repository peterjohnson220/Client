import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard, LoadUserGuard, LoadCompanyGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { UsersListPageComponent, UserPageComponent } from 'libs/features/users/user-management';

import {
  NavigationPageComponent,
  SecuritySettingsPageComponent,
  UserRolePageComponent,
  BulkAddUsersPageComponent
} from './';



const routes: Routes = [
  {
    path: 'navigation', component: NavigationPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.COMPANY_ADMIN], Check: PermissionCheckEnum.Single }
  },
  {
    path: 'user-role', component: UserRolePageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.USER_ROLES], Check: PermissionCheckEnum.Single }
  },
  {
    path: 'securitysettings', component: SecuritySettingsPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.SECURITY_SETTINGS], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/users', component: UsersListPageComponent, canActivate: [AuthorizationGuard, LoadCompanyGuard],
    data: { Permissions: [Permissions.USERS], Check: PermissionCheckEnum.Single, ReturnUrl: 'company-admin/navigation' }
  },
  {
    path: ':companyId/users/add', component: UserPageComponent, canActivate: [AuthorizationGuard, LoadCompanyGuard],
    data: { Permissions: [Permissions.ADD_USER], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/users/:userId', component: UserPageComponent, canActivate: [AuthorizationGuard, LoadCompanyGuard, LoadUserGuard],
    data: { Permissions: [Permissions.USERS], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/bulkAdd', component: BulkAddUsersPageComponent, canActivate: [AuthorizationGuard, LoadCompanyGuard],
    data: { Permissions: [Permissions.BULK_ADD_USERS], Check: PermissionCheckEnum.Single }
  },
  { path: '', redirectTo: 'navigation', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAdminRoutingModule { }
