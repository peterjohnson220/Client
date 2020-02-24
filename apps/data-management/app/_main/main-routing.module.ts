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
  OutboundAuthenticationPageComponent,
  OutboundEntitySelectionPageComponent,
  OutboundFieldMappingPageComponent,
  OutboundJdmViewSelectionPageComponent,
  OutboundProviderSelectionPageComponent,
  OutboundTransferSchedulePageComponent,
  ResetIntegrationPageComponent,
  TransferDataPageComponent,
  TransferSchedulePageComponent,
} from './containers';

const routes: Routes = [
  {
    path: 'org-data-load',
    component: OrgDataLoadComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.DATAMANAGEMENT_ORG_DATA_LOAD], Check: PermissionCheckEnum.Any }
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
              },
              {
                path: 'transfer-schedule',
                component: TransferSchedulePageComponent,
                data: { FullPage: true }
              },
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
                component: OutboundTransferSchedulePageComponent,
                data: { FullPage: true }
              },
              {
                path: 'jdm-view-selection',
                component: OutboundJdmViewSelectionPageComponent
              },
            ]
          }
        ]
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
