import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PfServicesAdminOnlyGuard } from 'libs/security/guards';

import {
  PricingLoadersComponent
} from './containers';

const routes: Routes = [
  {
    path: 'pricing-loader',
    component: PricingLoadersComponent,
    canActivate: [PfServicesAdminOnlyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingLoadersRoutingModule { }
