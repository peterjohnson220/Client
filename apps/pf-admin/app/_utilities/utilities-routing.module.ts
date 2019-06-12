import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PfAdminGuard } from 'libs/security';

import { SelectCompanyPageComponent, YoyDefaultScopesPageComponent } from './containers';

const routes: Routes = [
  { path: '', redirectTo: 'yoy-default-scopes', pathMatch: 'full' },
  { path: 'yoy-default-scopes', component: SelectCompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: 'yoy-default-scopes/:id', component: YoyDefaultScopesPageComponent, canActivate: [PfAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule { }
