import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfServicesAdminOnlyGuard } from 'libs/security';

import { LoaderDashboardPageComponent } from './loader-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LoaderDashboardPageComponent,
    canActivate: [PfServicesAdminOnlyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoaderDashboardPageRoutingModule { }
