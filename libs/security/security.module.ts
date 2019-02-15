import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard } from './guards';

@NgModule({
  providers:    [ UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard ]
})
export class PfSecurityModule { }
