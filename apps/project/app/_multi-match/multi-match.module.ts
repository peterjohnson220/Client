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

import * as fromFaIcons from './fa-icons';
import { JobToPriceComponent } from './components';
import {  MultiMatchPageComponent, JobsToPriceContainerComponent } from './containers';
import { MultiMatchPageEffects, JobsToPriceEffects } from './effects';
import { reducers } from './reducers';
import { MultiMatchRoutingModule } from './multi-match-routing.module';
import { SurveySearchModule } from '../survey-search/survey-search.module';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_multiMatch', reducers),
    EffectsModule.forFeature([MultiMatchPageEffects, JobsToPriceEffects
    ]),
    DragulaModule.forRoot(),
    FontAwesomeModule,

    // Routing
    MultiMatchRoutingModule,

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

    // Pages
    MultiMatchPageComponent
  ]
})
export class MultiMatchModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
