import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeListPageComponent } from './containers';
import { AdminPeerRoutingModule } from './admin-peer-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PFCommonUIModule } from '../../../../../libs/ui/common/common-ui-module';

@NgModule({
  imports:      [
    CommonModule,
    AdminPeerRoutingModule,

    PFCommonUIModule,

    // TODO: Can this be in something shared?
    NgbModule
  ],
  declarations: [ ExchangeListPageComponent ]
})
export class AdminPeerModule { }
