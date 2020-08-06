import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from '../shared/fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // Routing
    MainRoutingModule
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
