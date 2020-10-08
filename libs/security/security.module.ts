import { NgModule } from '@angular/core';

import { SettingsService } from '../state/app-context/services';
import {
  UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, TabularReportBuilderGuard,
  AuthorizationGuard, TileEnabledGuard, LoadUserGuard, LoadCompanyGuard,
  PfServicesAdminOnlyGuard
} from './guards';
import { JobsHierarchyPageGuard } from './guards/jobs-hierarchy-page.guard';

@NgModule({
  providers: [

    // Guards
    UserContextGuard,
    PfAdminGuard,
    PeerTileEnabledGuard,
    AuthorizationGuard,
    TileEnabledGuard,
    LoadUserGuard,
    LoadCompanyGuard,
    TabularReportBuilderGuard,
    PfServicesAdminOnlyGuard,
    JobsHierarchyPageGuard,

    // Services
    SettingsService
  ]
})
export class PfSecurityModule { }
