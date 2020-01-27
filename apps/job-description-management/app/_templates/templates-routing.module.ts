import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthorizationGuard} from 'libs/security/guards';
import {PermissionCheckEnum, Permissions} from 'libs/constants';

import { TemplateListPageComponent } from './template-list';
import { TemplatePageComponent } from './template';

const routes: Routes = [
  {
    path: '',
    component: TemplateListPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.CAN_MANAGE_JOB_DESCRIPTION_TEMPLATES, Permissions.CAN_EDIT_JOB_DESCRIPTION], Check: PermissionCheckEnum.Any},
  },
  {
    path: ':id',
    component: TemplatePageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.CAN_MANAGE_JOB_DESCRIPTION_TEMPLATES, Permissions.CAN_EDIT_JOB_DESCRIPTION], Check: PermissionCheckEnum.Single},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
