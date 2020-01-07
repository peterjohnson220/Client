import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { SurveyUdfManagerRoutingModule } from './survey-udf-manager-routing.module';

import * as fromFaIcons from './fa-icons';

import {
  UdfManagerModule
} from './';

@NgModule({
  imports: [
    CommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // 3rd Party
    FontAwesomeModule,

    // Routing
    SurveyUdfManagerRoutingModule,

    // Features
    UdfManagerModule,

  ]
})
export class SurveyUdfManagerModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}

