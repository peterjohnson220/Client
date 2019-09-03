import { NgModule } from '@angular/core';

import { SettingsService } from '../state/app-context/services';
import {
  UserContextGuard, PfAdminGuard, PeerTileEnabledGuard,
  AuthorizationGuard, TileEnabledGuard, PeerExchangeExplorerEnabledGuard, LoadUserGuard, LoadCompanyGuard
} from './guards';

@NgModule({
  providers: [

    // Guards
    UserContextGuard,
    PfAdminGuard,
    PeerTileEnabledGuard,
    AuthorizationGuard,
    TileEnabledGuard,
    PeerExchangeExplorerEnabledGuard,
    LoadUserGuard,
    LoadCompanyGuard,

    // Services
    SettingsService
  ]
})
export class PfSecurityModule { }
