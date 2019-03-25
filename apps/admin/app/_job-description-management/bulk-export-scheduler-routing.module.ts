import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import {PermissionCheckEnum, Permissions} from 'libs/constants';

import { BulkExportSchedulerPageComponent } from './containers/pages';


const routes: Routes = [
  { path: 'bulk-export-scheduler', component: BulkExportSchedulerPageComponent, canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.SCHEDULE_JDM_BULK_EXPORT], Check: PermissionCheckEnum.Single} },
  { path: '', redirectTo: 'bulk-export-scheduler', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JdmBulkExportSchedulerRoutingModule { }
