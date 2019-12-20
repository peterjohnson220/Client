import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AuthorizationGuard } from 'libs/security/guards';

import { ViewsListPageComponent } from './views-list';
import { ViewEditPageComponent, ViewEditGuard } from './view-edit';
import { LayoutPageComponent } from './layout';
import { FooterViewPageComponent } from './footer-view';
import { CompanyControlsListPageComponent } from './company-controls-list';
import { CompanyControlsDetailPageComponent, CompanyControlsDetailViewGuard } from './company-controls-detail';
import { RoutingWorkflowsPageComponent } from './routing-workflows';


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
      },
      {
        path: 'jdm-footer-view',
        component: FooterViewPageComponent
      },
      {
        path: 'company-controls',
        component: CompanyControlsListPageComponent
      },
      {
        path: 'company-controls/detail',
        component: CompanyControlsDetailPageComponent,
        canActivate: [CompanyControlsDetailViewGuard]
      },
      {
        path: 'workflows',
        component: RoutingWorkflowsPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
