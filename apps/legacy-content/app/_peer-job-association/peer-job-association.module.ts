import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeerJobAssociationRoutingModule } from './peer-job-association-routing.module';
import { LegacyContentPeerJobAssociationModalComponent } from './containers/job-association-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party

    // Routing
    PeerJobAssociationRoutingModule,

    // Payfactors
  ],
  declarations: [
    // Components
    // Containers
    LegacyContentPeerJobAssociationModalComponent
    // Pages
  ],
  providers: [
  ]
})
export class PeerJobAssociationModule {
}
