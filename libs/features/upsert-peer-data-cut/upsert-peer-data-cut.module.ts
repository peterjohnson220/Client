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
import { UpsertPeerDataCutComponent } from './upsert-peer-data-cut';
import { UpsertPeerDataCutEffects, RequestPeerAccessEffects } from './effects';
import { UpsertPeerDataModalComponent } from './containers/modals/upsert-peer-data-modal';
import {PfFormsModule} from '../../forms';
import {DojGuidelinesService} from '../peer/guidelines-badge/services/doj-guidelines.service';

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
    PfFormsModule,
    GuidelinesBadgeModule
  ],
  declarations: [
    UpsertPeerDataCutComponent, UpsertPeerDataModalComponent
  ],
  providers: [WindowCommunicationService, DojGuidelinesService],
  exports: [UpsertPeerDataCutComponent, UpsertPeerDataModalComponent]
})
export class UpsertPeerDataCutModule {
  constructor() {}
}
