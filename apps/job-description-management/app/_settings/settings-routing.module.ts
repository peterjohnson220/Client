import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AuthorizationGuard } from 'libs/security/guards';

import { JobDescriptionViewsListPageComponent } from './job-description-views-list';
import { LayoutPageComponent } from './layout';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    canActivateChild: [AuthorizationGuard],
    data: {Permissions: [Permissions.CAN_MANAGE_JOB_DESCRIPTION_SETTINGS], Check: PermissionCheckEnum.Single},
    children: [
      {
        path: '',
        redirectTo: 'job-description-views',
        pathMatch: 'full'
      },
      {
        path: 'job-description-views',
        component: JobDescriptionViewsListPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
