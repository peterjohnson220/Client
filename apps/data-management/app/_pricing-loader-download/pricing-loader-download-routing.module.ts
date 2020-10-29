import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { UrlParameterValidationGuard } from 'libs/security/guards';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import {
  PricingLoaderDownloadComponent
} from './containers';


const routes: Routes = [
  {
    path: 'pricing-loaders-download',
    component: PricingLoaderDownloadComponent,
    canActivate: [UrlParameterValidationGuard],
    data: { Permissions: [Permissions.CAN_DOWNLOAD_PRICING_DATA], Check: PermissionCheckEnum.Single }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingLoaderDownloadRoutingModule { }
