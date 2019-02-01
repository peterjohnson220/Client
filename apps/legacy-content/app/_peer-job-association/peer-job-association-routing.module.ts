import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegacyContentPeerJobAssociationModalComponent } from './containers/job-association-modal';

const routes: Routes = [
  {
    path: '',
    component: LegacyContentPeerJobAssociationModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeerJobAssociationRoutingModule { }
