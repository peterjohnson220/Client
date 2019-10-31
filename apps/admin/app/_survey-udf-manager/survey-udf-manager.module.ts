import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

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
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}

