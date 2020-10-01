import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PfServicesAdminOnlyGuard } from 'libs/security/guards';

import {
  PricingLoaderDownloadComponent
} from './containers';

const routes: Routes = [
  {
    path: 'pricing-loaders-download',
    component: PricingLoaderDownloadComponent,
    canActivate: [PfServicesAdminOnlyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingLoaderDownloadRoutingModule { }
