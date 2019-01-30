import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobAssociationRoutingModule } from './job-association-routing.module';
import { JobAssociationModalComponent } from './containers/job-association-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party

    // Routing
    JobAssociationRoutingModule

    // Payfactors
  ],
  declarations: [
    // Components
    // Containers
    JobAssociationModalComponent
    // Pages
  ],
  providers: [
  ]
})
export class JobAssociationModule {
}
