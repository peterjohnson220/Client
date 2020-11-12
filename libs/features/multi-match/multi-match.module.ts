import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SurveySearchModule } from 'libs/features/survey-search';
import { UpsertPeerDataCutModule } from 'libs/features/upsert-peer-data-cut';

import * as fromFaIcons from './fa-icons';
import {JobToPriceComponent} from './components';
import { JobsToPriceContainerComponent } from './containers';
import {MultiMatchEffects, JobsToPriceEffects, ModifyPricingsEffects} from './effects';
import { reducers } from './reducers';
import {MultiMatchComponent} from './multi-match';
import {WindowCommunicationService} from '../../core/services';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_multiMatch', reducers),
    EffectsModule.forFeature([MultiMatchEffects, JobsToPriceEffects, ModifyPricingsEffects
    ]),
    DragulaModule.forRoot(),
    FontAwesomeModule,


    // Payfactors
    SurveySearchModule,
    UpsertPeerDataCutModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule
  ],
  declarations: [
    // Components
    JobToPriceComponent,

    // Containers
    JobsToPriceContainerComponent,
    MultiMatchComponent,
  ],
  exports: [MultiMatchComponent],
  providers: [WindowCommunicationService]
})
export class MultiMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
