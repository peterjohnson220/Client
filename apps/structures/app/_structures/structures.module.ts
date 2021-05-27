import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';

import { StructuresPageComponent } from './structures.page';
import { StructuresRoutingModule } from './structures-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,

    // Routing
    StructuresRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule
  ],
  declarations: [
    StructuresPageComponent
  ],
  exports: []
})
export class StructuresModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
