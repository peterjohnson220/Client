import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadsModule } from '@progress/kendo-angular-upload';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';
import { SurveyDataFieldsManagementModule } from 'libs/features/surveys';
import { ExportPopoverModule } from 'libs/features/export-popover';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import { SurveysPageComponent } from './surveys.page';
import { SurveysRoutingModule } from './surveys-routing.module';
import { SurveyDataCutsComponent, SurveyParticipationComponent, SurveyParticipationDetailsComponent } from './containers';
import { PfSurveyJobDetailsComponent, ViewParticipantsListComponent } from './components';
import { SurveyJobDetailsPipe } from './pipes';
import { SurveyPageEffects, SurveyParticipationEffects } from './effects';

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
    EffectsModule.forFeature([
      SurveyPageEffects,
      SurveyParticipationEffects
    ]),
    FontAwesomeModule,
    DropDownListModule,
    NgbModule,
    NgbDropdownModule,
    UploadsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    SurveyDataFieldsManagementModule,
    ExportPopoverModule
  ],
  declarations: [
    // Pages
    SurveysPageComponent,

    // Containers
    SurveyDataCutsComponent,
    SurveyParticipationComponent,
    SurveyParticipationDetailsComponent,

    // Components
    PfSurveyJobDetailsComponent,
    ViewParticipantsListComponent,

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
