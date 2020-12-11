import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PfAdminGuard } from 'libs/security/guards';

import { TabularReportExportSchedulerPageComponent } from './containers/pages/tabular-report-export-scheduler-page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabular-report-export-scheduler',
    pathMatch: 'full',
    canActivate: [PfAdminGuard]
  },
  {
    path: 'tabular-report-export-scheduler',
    component: TabularReportExportSchedulerPageComponent,
    canActivate: [PfAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabularReportManagementRoutingModule { }
