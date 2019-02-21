import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';

import { JobAssociationModule } from 'libs/features/peer/job-association/job-association.module';

import { PeerJobAssociationRoutingModule } from './peer-job-association-routing.module';
import { LegacyContentPeerJobAssociationModalComponent } from './containers/job-association-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    GridModule,

    // Routing
    PeerJobAssociationRoutingModule,

    // Payfactors
    JobAssociationModule,
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
