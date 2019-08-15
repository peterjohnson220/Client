import { NgModule } from '@angular/core';

import { SettingsService } from '../state/app-context/services';
import {
  UserContextGuard, PfAdminGuard, PeerTileEnabledGuard,
  AuthorizationGuard, TileEnabledGuard, PeerExchangeExplorerEnabledGuard
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

    // Services
    SettingsService
  ]
})
export class PfSecurityModule { }
