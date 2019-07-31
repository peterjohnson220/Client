import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard, TileEnabledGuard, LoadUserGuard, LoadCompanyGuard } from './guards';

@NgModule({
  providers: [
    UserContextGuard,
    PfAdminGuard,
    PeerTileEnabledGuard,
    AuthorizationGuard,
    TileEnabledGuard,
    LoadUserGuard,
    LoadCompanyGuard
  ]
})
export class PfSecurityModule { }
