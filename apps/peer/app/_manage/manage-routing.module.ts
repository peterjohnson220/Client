import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizationGuard, PeerTileEnabledGuard } from 'libs/security/guards';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

import { ExchangeJobMappingPageComponent } from './containers/pages';

const routes: Routes = [
  { path: '',
    component: ExchangeJobMappingPageComponent,
    canActivate: [AuthorizationGuard],
    data: {Permissions: [Permissions.PEER_MANAGE_JOBS], Check: PermissionCheckEnum.Single}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
