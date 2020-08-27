import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfExchangeExplorerModule, GuidelinesBadgeModule } from 'libs/features/peer';

import { reducers } from './reducers';
import { UpsertPeerDataCutComponent } from './components/upsert-peer-data-cut';
import { UpsertPeerDataCutEffects, RequestPeerAccessEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('peer_upsertDataCut', reducers),
    EffectsModule.forFeature([UpsertPeerDataCutEffects, RequestPeerAccessEffects]),
    NgbPopoverModule,
    NgbTooltipModule,
    DropDownsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfExchangeExplorerModule,
    GuidelinesBadgeModule
  ],
  declarations: [
    UpsertPeerDataCutComponent
  ],
  providers: [WindowCommunicationService],
  exports: [UpsertPeerDataCutComponent]
})
export class UpsertPeerDataCutModule {
  constructor() {}
}
