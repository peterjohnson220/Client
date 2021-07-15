import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { DragulaModule } from 'ng2-dragula';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search/search';
import { SurveySearchModule } from 'libs/features/surveys/survey-search';
import { UpsertPeerDataCutModule } from 'libs/features/pricings/upsert-peer-data-cut';
import { DataCutSummaryModule } from 'libs/features/pricings/data-cut-summary';
import { PricingProjectHelperService, WindowCommunicationService } from 'libs/core/services';

import * as fromFaIcons from './fa-icons';
import { JobToPriceComponent, DataCutTitleComponent } from './components';
import { JobsToPriceContainerComponent } from './containers';
import { MultiMatchEffects, JobsToPriceEffects, ModifyPricingsEffects } from './effects';
import { MultiMatchComponent } from './multi-match';
import { reducers } from './reducers';
import { TempDataCutService } from './services';

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
    TooltipModule,

    // Payfactors
    SurveySearchModule,
    UpsertPeerDataCutModule,
    DataCutSummaryModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule
  ],
  declarations: [
    // Components
    JobToPriceComponent,
    DataCutTitleComponent,

    // Containers
    JobsToPriceContainerComponent,
    MultiMatchComponent,
  ],
  exports: [MultiMatchComponent],
  providers: [WindowCommunicationService, TempDataCutService, PricingProjectHelperService]
})
export class MultiMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
