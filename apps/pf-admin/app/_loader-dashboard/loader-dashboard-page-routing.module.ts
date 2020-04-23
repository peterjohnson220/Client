import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PfAdminGuard} from 'libs/security';

import { LoaderDashboardPageComponent } from './loader-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LoaderDashboardPageComponent,
    canActivate: [PfAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoaderDashboardPageRoutingModule { }
