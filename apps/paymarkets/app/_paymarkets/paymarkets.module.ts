import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { PayMarketsPageComponent } from './paymarkets.page';
import { PayMarketsRoutingModule } from './paymarkets-routing.module';
import { GridActionsComponent } from './containers';
import { GridActionsBarEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    PayMarketsRoutingModule,

    // 3rd party
    StoreModule.forFeature('paymarkets_main', reducers),
    EffectsModule.forFeature([
      GridActionsBarEffects
    ]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    PayMarketsPageComponent,

    // Containers
    GridActionsComponent
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService}
  ]
})
export class PayMarketsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
