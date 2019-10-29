import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import {
  JobDescriptionJobComparePageComponent,
  JobDescriptionListPageComponent,
  JobDescriptionVersionComparePageComponent,
  JobDescriptionPageComponent
} from './containers';
import { JobDescriptionJobCompareListResolver, ResolveHistoryListGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: JobDescriptionListPageComponent
  },
  {
    path: 'compare-jobs/:id',
    component: JobDescriptionJobComparePageComponent,
    resolve: {jobDescriptionList: JobDescriptionJobCompareListResolver},
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'compare-versions/:id',
    component: JobDescriptionVersionComparePageComponent,
    resolve: {historyList: ResolveHistoryListGuard},
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'job-descriptions/:id',
    component: JobDescriptionPageComponent,
    resolve: {historyList: ResolveHistoryListGuard},
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule {
}
