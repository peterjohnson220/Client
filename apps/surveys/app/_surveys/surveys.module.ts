import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { SurveysPageComponent } from './surveys.page/surveys.page';
import { SurveysRoutingModule } from './surveys-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    SurveysRoutingModule,

    // 3rd party
    StoreModule.forFeature('surveys_main', reducers),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    SurveysPageComponent
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService }
  ]
})
export class SurveysModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
