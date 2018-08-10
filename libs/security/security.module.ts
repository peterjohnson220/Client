import { NgModule } from '@angular/core';

import { UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, CompanyAdminGuard } from './guards';

@NgModule({
  providers:    [ UserContextGuard, PfAdminGuard, PeerTileEnabledGuard, CompanyAdminGuard ]
})
export class PfSecurityModule { }
