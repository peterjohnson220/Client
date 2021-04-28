import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { SurveysPageComponent } from './surveys.page/surveys.page';
import { SurveysRoutingModule } from './surveys-routing.module';
import { SurveyDataCutsComponent } from './containers';
import { PfSurveyJobDetailsComponent } from './components/pf-survey-job-details/pf-survey-job-details.component';
import { SurveyJobDetailsPipe } from './pipes/survey-job-details.pipe';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // Routing
    SurveysRoutingModule,

    // 3rd party
    StoreModule.forFeature('surveys_main', reducers),
    FontAwesomeModule,
    DropDownListModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
  ],
  declarations: [
    // Pages
    SurveysPageComponent,

    // Containers
    SurveyDataCutsComponent,

    // Components
    PfSurveyJobDetailsComponent,

    // Pipes
    SurveyJobDetailsPipe
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
