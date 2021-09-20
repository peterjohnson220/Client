import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { ReviewLinkExpiredPageComponent } from 'libs/ui/common/error/pages/review-link-expired';
import { WorkflowStepMessagePageComponent } from '../shared/components/workflow-step-message';

import {
  JobDescriptionJobComparePageComponent,
  JobDescriptionListPageComponent,
  JobDescriptionVersionComparePageComponent,
  JobDescriptionPageComponent,
  JobDescriptionWorkflowComparePageComponent,
  JobDescriptionInboxPageComponent,
  JobDescriptionCollaborationPageComponent,
} from './containers';
import { ResolveHistoryListGuard } from './guards';

const routes: Routes = [
  { path: '', redirectTo: 'job-descriptions', pathMatch: 'full' },
  {
    path: 'job-descriptions',
    component: JobDescriptionListPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'job-descriptions/compare-jobs/:id',
    component: JobDescriptionJobComparePageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'job-descriptions/compare-versions/:id',
    component: JobDescriptionVersionComparePageComponent,
    resolve: {historyList: ResolveHistoryListGuard},
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'job-descriptions/workflow/compare-versions/:id',
    component: JobDescriptionWorkflowComparePageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'job-descriptions/:id',
    component: JobDescriptionPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'inbox',
    component: JobDescriptionInboxPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'collaboration',
    component: JobDescriptionCollaborationPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.JOB_DESCRIPTIONS, Permissions.CAN_VIEW_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any}
  },
  {
    path: 'system-message',
    component: WorkflowStepMessagePageComponent
  },
  {
    path: 'in-system-gone',
    component: ReviewLinkExpiredPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule {
}
