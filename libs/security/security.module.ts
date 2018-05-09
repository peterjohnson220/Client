import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard } from './guards';

@NgModule({
  providers:    [ UserContextGuard, PfAdminGuard, PeerTileEnabledGuard ]
})
export class PfSecurityModule { }
