import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoadCompanyGuard, LoadUserGuard, PfAdminGuard } from 'libs/security';
import { UsersListPageComponent, UserPageComponent } from 'libs/features/users/user-management';

import { CompaniesListPageComponent, CompanyPageComponent } from './containers';


const routes: Routes = [
  { path: '', component: CompaniesListPageComponent, canActivate: [PfAdminGuard] },
  { path: 'add', component: CompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: 'edit/:companyId', component: CompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: ':companyId/users', component: UsersListPageComponent, canActivate: [PfAdminGuard, LoadCompanyGuard], data: { ReturnUrl: 'companies'} },
  { path: ':companyId/users/add', component: UserPageComponent, canActivate: [PfAdminGuard, LoadCompanyGuard] },
  { path: ':companyId/users/:userId', component: UserPageComponent, canActivate: [PfAdminGuard, LoadCompanyGuard, LoadUserGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
