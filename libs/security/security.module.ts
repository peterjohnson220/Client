import { NgModule } from '@angular/core';

import { SettingsService } from '../state/app-context/services';
import {
  UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, PermissionGuard,
  AuthorizationGuard, TileEnabledGuard, LoadUserGuard, LoadCompanyGuard,
  PfServicesAdminByRepositoryGuard, UrlParameterValidationGuard
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

    // Services
    SettingsService
  ]
})
export class PfSecurityModule { }
