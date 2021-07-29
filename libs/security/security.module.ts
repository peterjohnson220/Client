import { NgModule } from '@angular/core';

import { SettingsService } from '../state/app-context/services';
import {
  UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, PermissionGuard,
  AuthorizationGuard, TileEnabledGuard, LoadUserGuard, LoadCompanyGuard,
  PfServicesAdminByRepositoryGuard, UrlParameterValidationGuard, FeatureFlagGuard
} from './guards';


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
    PermissionGuard,
    PfServicesAdminByRepositoryGuard,
    UrlParameterValidationGuard,
    FeatureFlagGuard,

    // Services
    SettingsService
  ]
})
export class PfSecurityModule { }
