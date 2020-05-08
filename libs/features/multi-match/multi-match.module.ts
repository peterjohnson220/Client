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

import * as fromFaIcons from './fa-icons';
import {JobToPriceComponent} from './components';
import { JobsToPriceContainerComponent } from './containers';
import { MultiMatchEffects, JobsToPriceEffects } from './effects';
import { reducers } from './reducers';
import {MultiMatchComponent} from './multi-match';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_multiMatch', reducers),
    EffectsModule.forFeature([MultiMatchEffects, JobsToPriceEffects
    ]),
    DragulaModule.forRoot(),
    FontAwesomeModule,


    // Payfactors
    SurveySearchModule,
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
  exports: [MultiMatchComponent]
})
export class MultiMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
