import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PermissionCheckEnum, Permissions } from 'libs/constants';

import {PricingProjectPageComponent} from './pricing-project.page/pricing-project.page';
import {HasAccessToProjectGuard} from '../shared/guards';


const routes: Routes = [{
  path: ':projectId',
  component: PricingProjectPageComponent,
  canActivate: [HasAccessToProjectGuard],
  data: {
    Permissions: [Permissions.PRICING_PROJECTS],
    Check: PermissionCheckEnum.Single
  }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PricingProjectPageRoutingModule { }
