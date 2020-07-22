import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';

import {PermissionCheckEnum, Permissions} from 'libs/constants';
import {AuthorizationGuard, PfAdminGuard} from 'libs/security/guards';

import {
  CustomEmployeeIdentifierComponent,
  DataManagementHomePageComponent,
  DataManagementLandingPageComponent,
  FieldMappingPageComponent,
  InboundAuthenticationPageComponent,
  InboundEntitySelectionPageComponent,
  InboundProvidersPageComponent,
  OrgDataLoadComponent,
  OutboundAuthenticationPageComponent,
  OutboundFieldMappingPageComponent,
  OutboundJdmViewSelectionPageComponent,
  OutboundProviderSelectionPageComponent,
  OutboundTransferSchedulePageComponent,
  ResetIntegrationPageComponent,
  TransferDataPageComponent,
  TransferSchedulePageComponent,
} from './containers';
import { HrisAuthenticationGuard } from './guards';

const routes: Routes = [
  {
    path: 'org-data-load',
    component: OrgDataLoadComponent,
    canActivate: [AuthorizationGuard],
    data: { Permissions: [Permissions.COMPANY_ADMIN], Check: PermissionCheckEnum.Any }
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
            canActivateChild: [AuthorizationGuard],
            data: { Permissions: [Permissions.HRIS_INBOUND_INTEGRATION], Check: PermissionCheckEnum.Any },
            children: [
              {
                path: 'vendor',
                component: InboundProvidersPageComponent
              },
              {
                path: 'entity-selection',
                component: InboundEntitySelectionPageComponent
              },
              {
                path: 'field-mapping',
                component: FieldMappingPageComponent,
                canActivate: [HrisAuthenticationGuard],
                data: { FullerPage: true }
              },
              {
                path: 'authentication',
                component: InboundAuthenticationPageComponent
              },
              {
                path: 'transfer-schedule',
                component: TransferSchedulePageComponent,
                canActivate: [HrisAuthenticationGuard],
                data: { FullPage: true }
              },
            ]
          },
          {
            path: 'outbound',
            canActivateChild: [AuthorizationGuard],
            data: { Permissions: [Permissions.HRIS_OUTBOUND_INTEGRATION], Check: PermissionCheckEnum.Any },
            children: [
              {
                path: 'vendor',
                component: OutboundProviderSelectionPageComponent
              },
              {
                path: 'authentication',
                component: OutboundAuthenticationPageComponent
              },
              {
                path: 'field-mapping',
                component: OutboundFieldMappingPageComponent,
                data: { FullerPage: true }
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
