import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { ProjectListPageComponent } from './project-list.page/project-list.page';

const routes: Routes = [{
  path: '',
  component: ProjectListPageComponent,
  canActivate: [AuthorizationGuard],
  data: {
    Permissions: [Permissions.PRICING_PROJECTS],
    Check: PermissionCheckEnum.Single
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProjectListPageRoutingModule { }
