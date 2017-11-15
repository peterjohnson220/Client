import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeerAdminRoutingModule } from './peer-admin-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    PeerAdminRoutingModule
  ],
  declarations: []
})
export class PeerAdminModule { }
