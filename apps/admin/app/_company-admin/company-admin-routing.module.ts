import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard, LoadUserGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { NavigationPageComponent, PasswordManagementPageComponent, UserRolePageComponent } from './containers';
import { CompanyAdminUsersListPageComponent } from './components/pages/company-admin-users-list';
import { UserPageComponent } from './pages';

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
    path: 'passwordmanagement', component: PasswordManagementPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.PASSWORD_MANAGEMENT], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/users', component: CompanyAdminUsersListPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.USERS], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/users/add', component: UserPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.ADD_USER], Check: PermissionCheckEnum.Single }
  },
  {
    path: ':companyId/users/:userId', component: UserPageComponent, canActivate: [AuthorizationGuard, LoadUserGuard],
    data: { Permissions: [Permissions.USERS], Check: PermissionCheckEnum.Single }
  },
  { path: '', redirectTo: 'navigation', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAdminRoutingModule { }
