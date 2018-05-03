import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { WindowCommunicationService } from 'libs/core/services';
import { PfPeerMapModule } from 'libs/features/peer/map';

import { AddDataCutPageComponent } from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import { AddDataCutPageEffects } from './effects';
import { reducers } from './reducers';
import { GuidelinesBadgeComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd party
    StoreModule.forFeature('legacy_addPeerData', reducers),
    EffectsModule.forFeature([
      AddDataCutPageEffects
    ]),
    NgbPopoverModule,

    // Routing
    PeerRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfPeerMapModule
  ],
  declarations: [
    // Components
    GuidelinesBadgeComponent,

    // Pages
    AddDataCutPageComponent
  ],
  providers: [
    WindowCommunicationService
  ]
})
export class PeerModule { }
