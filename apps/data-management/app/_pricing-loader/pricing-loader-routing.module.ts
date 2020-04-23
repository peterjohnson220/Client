import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AuthorizationGuard, PfAdminGuard } from 'libs/security/guards';

import {
  PricingLoadersComponent
} from './containers';

const routes: Routes = [
  {
    path: 'pricing-loaders',
    component: PricingLoadersComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.DATAMANAGEMENT_ORG_DATA_LOAD], Check: PermissionCheckEnum.Any }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingLoadersRoutingModule { }
