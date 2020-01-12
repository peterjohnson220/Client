import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {PermissionCheckEnum, Permissions} from 'libs/constants';
import {AuthorizationGuard} from 'libs/security/guards';

import {
  DataManagementHomePageComponent,
  DataManagementLandingPageComponent,
  OrgDataLoadComponent,
  TransferDataPageComponent,
  TransferSchedulePageComponent
} from './containers';

const routes: Routes = [
  {
    path: 'org-data-load',
    component: OrgDataLoadComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.DATAMANAGEMENT_ORG_DATA_LOAD, Permissions.DATA_MANAGEMENT], Check: PermissionCheckEnum.Any },
  },
  {
    path: '',
    component: DataManagementHomePageComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.DATA_MANAGEMENT], Check: PermissionCheckEnum.Any },
    // TODO: Need to determine subpermissions and consolidate pages
    children: [
      {
        path: '',
        component: DataManagementLandingPageComponent,
        data: { FullPage: true }
      },
      {
        path: 'transfer-data',
        component: TransferDataPageComponent
      },
      {
        path: 'transfer-schedule',
        component: TransferSchedulePageComponent,
        data: { FullPage: true }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
