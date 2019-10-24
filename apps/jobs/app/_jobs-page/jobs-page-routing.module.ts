import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { JobsPageComponent } from './jobs.page/jobs.page';

const routes: Routes = [
  {
    path: '',
    component: JobsPageComponent,
    canActivate: [AuthorizationGuard],
    data: {
      Permissions: [Permissions.JOBS],
      Check: PermissionCheckEnum.Single
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class JobsPageRoutingModule { }
