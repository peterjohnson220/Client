import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security/guards';

import { StandardReportsListPageComponent } from './containers/pages/standard-reports-list-page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'payfactors-reports',
    pathMatch: 'full',
    canActivate: [PfAdminGuard]
  },
  {
    path: 'payfactors-reports',
    component: StandardReportsListPageComponent,
    canActivate: [PfAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataInsightsRoutingModule { }
