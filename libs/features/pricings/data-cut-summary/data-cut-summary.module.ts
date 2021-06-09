import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from '../../../ui/common/common-ui-module';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { reducers } from './reducers';
import { DataCutSummaryComponent } from './data-cut-summary/data-cut-summary.component';
import { DataCutSummaryEffects } from './effects';
import { DataCutSummaryDetailsComponent } from './components/data-cut-summary-details/data-cut-summary-details.component';
import { PeerDataCutSummaryComponent } from './components/peer-data-cut-summary/peer-data-cut-summary.component';
import { DataCutSummaryPropertyComponent } from './components/data-cut-summary-property/data-cut-summary-property.component';
import { TempDataCutModule } from '../../temp-data-cut/temp-data-cut.module';

import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    TempDataCutModule,

    StoreModule.forFeature('feature_dataCutSummary', reducers),
    EffectsModule.forFeature([
      DataCutSummaryEffects,
    ]),
    FontAwesomeModule
  ],
  declarations: [
    // Components
    DataCutSummaryComponent,
    DataCutSummaryPropertyComponent,
    DataCutSummaryDetailsComponent,
    PeerDataCutSummaryComponent
  ],
  exports: [DataCutSummaryComponent]
})
export class DataCutSummaryModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
