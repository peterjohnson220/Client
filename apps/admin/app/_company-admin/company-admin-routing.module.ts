import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import {PermissionCheckEnum, Permissions} from 'libs/constants';

import { UserRolePageComponent } from './containers/pages';


const routes: Routes = [
  { path: 'user-role', component: UserRolePageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.USER_ROLES], Check: PermissionCheckEnum.Single}
  },
  { path: '', redirectTo: 'user-role', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAdminRoutingModule { }
