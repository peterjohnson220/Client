import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { TabularReportExportSchedulerPageComponent } from './containers/pages/tabular-report-export-scheduler-page';

const routes: Routes = [
  {
    path: '', redirectTo: 'tabular-report-export-scheduler', pathMatch: 'full', canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.SCHEDULE_TABULAR_REPORT_EXPORT], Check: PermissionCheckEnum.Single }
  },
  {
    path: 'tabular-report-export-scheduler', component: TabularReportExportSchedulerPageComponent, canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.SCHEDULE_TABULAR_REPORT_EXPORT], Check: PermissionCheckEnum.Single }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabularReportManagementRoutingModule { }
