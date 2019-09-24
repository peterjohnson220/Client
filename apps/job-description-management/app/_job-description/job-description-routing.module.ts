import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthorizationGuard} from 'libs/security/guards';
import {PermissionCheckEnum, Permissions} from 'libs/constants';

import { JobDescriptionListPageComponent } from './containers/pages';
import {
  JobDescriptionVersionComparePageComponent
} from './containers/pages/job-description-version-compare/job-description-version-compare.page';
import {ResolveHistoryListGuard} from './guards/resolve-history-list.guard';

const routes: Routes = [
  {
    path: '',
    component: JobDescriptionListPageComponent
  },
  {
    path: 'compare-versions/:id',
    component: JobDescriptionVersionComparePageComponent,
    resolve: { historyList: ResolveHistoryListGuard },
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule { }
