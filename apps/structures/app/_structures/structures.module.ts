import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import {PfFormsModule} from 'libs/forms';

import * as fromFaIcons from './fa-icons';

import { StructuresPageComponent } from './structures.page';
import { StructuresRoutingModule } from './structures-routing.module';
import { StructuresPageEffects } from '../_structures/effects';
import { reducers } from '../_structures/reducers';

@NgModule({
    imports: [
        // Angular
        CommonModule,

        // 3rd Party
        FontAwesomeModule,
        NgbModule,
        StoreModule.forFeature('structures_main', reducers),
        EffectsModule.forFeature([
          StructuresPageEffects
        ]),

        // Routing
        StructuresRoutingModule,

        // Payfactors
        PfCommonModule,
        PfCommonUIModule,
        PfDataGridModule,
        PfFormsModule
    ],
  declarations: [
    StructuresPageComponent
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService }
  ]
})
export class StructuresModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
