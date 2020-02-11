import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';
import { SharedModule } from '../shared';
import { StatementEditModule } from './';
import { StatementListModule } from './';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    SharedModule,
    FontAwesomeModule,

    // Features
    StatementEditModule,
    StatementListModule
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
