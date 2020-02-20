import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AuthorizationGuard, PfAdminGuard } from 'libs/security/guards';

import {
  CustomEmployeeIdentifierComponent,
  DataManagementHomePageComponent,
  DataManagementLandingPageComponent,
  FieldMappingPageComponent,
  InboundAuthenticationPageComponent,
  InboundEntitySelectionPageComponent,
  OrgDataLoadComponent,
  ResetIntegrationPageComponent,
  TransferDataPageComponent,
  TransferSchedulePageComponent,
  OutboundProviderSelectionPageComponent,
  OutboundTransferSchedulePageComponent,
  OutboundFieldMappingPageComponent,
  OutboundEntitySelectionPageComponent,
  OutboundAuthenticationPageComponent
} from './containers';

const routes: Routes = [
  {
    path: 'org-data-load',
    component: OrgDataLoadComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.DATAMANAGEMENT_ORG_DATA_LOAD, Permissions.DATA_MANAGEMENT], Check: PermissionCheckEnum.Any }
  },
  {
    path: 'custom-employee-identifier',
    component: CustomEmployeeIdentifierComponent,
    canActivate: [PfAdminGuard]
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
        component: TransferDataPageComponent,
        children: [
          {
            path: 'inbound',
            children: [
              {
                path: 'entity-selection',
                component: InboundEntitySelectionPageComponent
              },
              {
                path: 'field-mapping',
                component: FieldMappingPageComponent
              },
              {
                path: 'authentication',
                component: InboundAuthenticationPageComponent
              }
            ]
          },
          {
            path: 'outbound',
            children: [
              {
                path: 'vendor',
                component: OutboundProviderSelectionPageComponent
              },
              {
                path: 'entity-selection',
                component: OutboundEntitySelectionPageComponent
              },
              {
                path: 'authentication',
                component: OutboundAuthenticationPageComponent
              },
              {
                path: 'field-mapping',
                component: OutboundFieldMappingPageComponent
              },
              {
                path: 'transfer-schedule',
                component: OutboundTransferSchedulePageComponent
              }
            ]
          }
        ]
      },
      {
        path: 'transfer-schedule',
        component: TransferSchedulePageComponent,
        data: { FullPage: true }
      },
      {
        path: 'reset',
        component: ResetIntegrationPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
