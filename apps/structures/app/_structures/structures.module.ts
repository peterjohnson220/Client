import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import {PfFormsModule} from 'libs/forms';

import * as fromFaIcons from './fa-icons';

import { StructuresPageComponent } from './structures.page';
import { StructuresRoutingModule } from './structures-routing.module';
import { SharedModule } from '../shared/shared.module';
import { StructuresPageEffects } from './effects';
import { reducers } from './reducers';
import { StructureFormComponent } from './containers';

@NgModule({
  imports: [
      // Angular
      CommonModule,
      FormsModule,
      ReactiveFormsModule,

      // 3rd Party
      FontAwesomeModule,
      NgbModule,
      DropDownsModule,
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
      PfFormsModule,

      // Shared
      SharedModule
    ],
  declarations: [
    StructuresPageComponent,
    StructureFormComponent
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
