import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PfAdminGuard } from 'libs/security';
import { NotFoundErrorPageComponent } from 'libs/ui/common/error/pages/not-found-error';

import {
  JobDescriptionLoaderPageComponent,
  SelectCompanyPageComponent,
  UtilitiesSelectCompanyPageComponent,
  YoyDefaultScopesPageComponent
} from './containers';
import { LoadJobDescriptionLoaderGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'yoy-default-scopes', pathMatch: 'full' },
  { path: 'yoy-default-scopes', component: SelectCompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: 'yoy-default-scopes/:id', component: YoyDefaultScopesPageComponent, canActivate: [PfAdminGuard] },
  { path: 'loadjobdescriptions', component: UtilitiesSelectCompanyPageComponent, canActivate: [PfAdminGuard] },
  { path: 'loadjobdescriptions/:id', component: JobDescriptionLoaderPageComponent, canActivate: [LoadJobDescriptionLoaderGuard, PfAdminGuard] },
  { path: 'not-found', component: NotFoundErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule { }
