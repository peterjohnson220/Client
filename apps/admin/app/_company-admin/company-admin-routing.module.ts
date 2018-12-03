import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyAdminGuard } from 'libs/security/guards';

import { UserRolePageComponent } from './containers/pages';

const routes: Routes = [
  { path: 'user-role', component: UserRolePageComponent, canActivate: [CompanyAdminGuard] },
  { path: '', redirectTo: 'user-role', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyAdminRoutingModule { }
