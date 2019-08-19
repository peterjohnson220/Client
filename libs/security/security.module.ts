import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard, TileEnabledGuard, LoadUserGuard } from './guards';

@NgModule({
  providers: [
    UserContextGuard,
    PfAdminGuard,
    PeerTileEnabledGuard,
    AuthorizationGuard,
    TileEnabledGuard,
    LoadUserGuard
  ]
})
export class PfSecurityModule { }
