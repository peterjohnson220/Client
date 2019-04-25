import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PfAdminGuard } from 'libs/security';
import { CompaniesListPageComponent } from './containers';

const routes: Routes = [
  { path: '', component: CompaniesListPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
