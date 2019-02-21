import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, CompanyAdminGuard, TileEnabledGuard } from './guards';

@NgModule({
  providers:    [ UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, CompanyAdminGuard, TileEnabledGuard ]
})
export class PfSecurityModule { }
