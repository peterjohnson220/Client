import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard, TileEnabledGuard  } from './guards';

@NgModule({
  providers:    [ UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, AuthorizationGuard, TileEnabledGuard   ]
})
export class PfSecurityModule { }
