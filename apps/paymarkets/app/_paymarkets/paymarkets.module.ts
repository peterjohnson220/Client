import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { PayMarketsPageComponent } from './paymarkets.page';
import { PayMarketsRoutingModule } from './paymarkets-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    PayMarketsRoutingModule,

    // 3rd party
    StoreModule.forFeature('paymarkets_main', reducers),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Pages
    PayMarketsPageComponent
  ]
})
export class PayMarketsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
