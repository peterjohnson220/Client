import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthorizationGuard} from 'libs/security/guards';
import {PermissionCheckEnum, Permissions} from 'libs/constants';

import {NavigationPageComponent, PasswordManagementPageComponent, UserRolePageComponent} from './containers';


const routes: Routes = [
  { path: 'navigation', component: NavigationPageComponent, canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.COMPANY_ADMIN], Check: PermissionCheckEnum.Single}
  },
  { path: 'user-role', component: UserRolePageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.USER_ROLES], Check: PermissionCheckEnum.Single}
  },
  { path: 'passwordmanagement', component: PasswordManagementPageComponent, canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.PASSWORD_MANAGEMENT], Check: PermissionCheckEnum.Single}
  },
  { path: '', redirectTo: 'user-role', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAdminRoutingModule { }
