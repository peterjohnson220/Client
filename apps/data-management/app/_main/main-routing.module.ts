import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import {PermissionCheckEnum, Permissions} from 'libs/constants';
import {AuthorizationGuard} from 'libs/security/guards';

import { DataAlertsPageComponent, DataManagementHomePageComponent, ManageDataPageComponent, TransferDataPageComponent,
  OrgDataLoadComponent } from './containers';

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
    // TODO: Need to determine subpermissions and consolidate pages
    children: [
      {
        path: 'data-alerts',
        component: DataAlertsPageComponent
      },
      {
        path: 'manage-data',
        component: ManageDataPageComponent
      },
      {
        path: 'transfer-data',
        component: TransferDataPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
