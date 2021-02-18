import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { JobsHierarchyPageComponent } from './containers/pages/jobs-hierarchy-page/jobs-hierarchy.page';

const routes: Routes = [
  {
    path: ':companyId', component: JobsHierarchyPageComponent, canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.CREATE_JOB_HIERARCHY], Check: PermissionCheckEnum.Single}
  },
  { path: '', redirectTo: 'jobs-hierarchy', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsHierarchyRoutingModule { }
