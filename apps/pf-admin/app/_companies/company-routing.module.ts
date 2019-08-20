import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PfAdminGuard } from 'libs/security';
import { CompaniesListPageComponent, CompanyPageComponent } from './containers';

const routes: Routes = [
  { path: '', component: CompaniesListPageComponent, canActivate: [PfAdminGuard] },
  { path: 'add', component: CompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: 'edit/:companyId', component: CompanyPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
