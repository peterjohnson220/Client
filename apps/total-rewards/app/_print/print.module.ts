import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import * as fromFaIcons from 'libs/features/total-rewards/total-rewards-statement/fa-icons';

import { PrintRoutingModule } from './print-routing.module';

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
    PrintRoutingModule
  ]
})
export class PrintModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
