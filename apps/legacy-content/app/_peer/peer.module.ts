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

import { UpsertDataCutPageComponent } from './containers';
import { PeerRoutingModule } from './peer-routing.module';
import { UpsertDataCutPageEffects, DataCutValidationEffects } from './effects';
import { reducers } from './reducers';
import { GuidelinesBadgeComponent } from './components';
import {DojGuidelinesService} from './services/doj-guidelines.service';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd party
    StoreModule.forFeature('legacy_upsertPeerData', reducers),
    EffectsModule.forFeature([
      UpsertDataCutPageEffects,
      DataCutValidationEffects
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
    UpsertDataCutPageComponent
  ],
  providers: [
    WindowCommunicationService, DojGuidelinesService
  ]
})
export class PeerModule { }
