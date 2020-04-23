import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { LabsPageRoutingModule } from './labs-page-routing.module';
import { LabsPageComponent } from './labs.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,

    // Routing
    LabsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    LabsPageComponent
  ]
})
export class LabsPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons();
  }
}
