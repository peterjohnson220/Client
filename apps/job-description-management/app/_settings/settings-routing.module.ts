import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AuthorizationGuard } from 'libs/security/guards';

import { ViewsListPageComponent } from './views-list';
import { ViewEditPageComponent, ViewEditGuard } from './view-edit';
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
        component: ViewsListPageComponent
      },
      {
        path: 'job-description-views/edit',
        component: ViewEditPageComponent,
        canActivate: [ViewEditGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
