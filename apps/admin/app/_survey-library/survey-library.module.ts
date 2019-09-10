import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfApiModule, SurveyLibraryApiService } from 'libs/data/payfactors-api';
import { PfCommonModule } from 'libs/core';

import * as fromFaIcons from './fa-icons';
import { SurveyComponent } from './containers/survey/survey.component';
import { SurveyLibraryRoutingModule } from './survey-library-routing.module';
import { AddSurveyModalComponent } from './containers/add-survey-modal/add-survey-modal.component';
import { SurveyLibraryStateService } from './services/survey-library-state.service';
import {
  AddSurveyTitleModalComponent,
  CustomSurveyTitleComponent,
  SurveyTitleListItemComponent,
  SurveyTitlesPageComponent,
  MapCompanyModalComponent
} from './containers';
import { SurveyTitleCompaniesListComponent, ExpandCollapseIconComponent } from './components';
import { CollapserDirective } from './directives';
import { reducers } from './reducers';
import { CompanySelectorEffects, SurveyTitlesEffects, SurveyEffects } from './effects';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // routing
    SurveyLibraryRoutingModule,

    // 3rd party
    StoreModule.forFeature('survey_library', reducers),
    EffectsModule.forFeature([
      SurveyTitlesEffects,
      CompanySelectorEffects,
      SurveyEffects
    ]),
    NgbPopoverModule,
    NgbTooltipModule,
    NgbModule,
    FontAwesomeModule,

    // PF Modules
    PfFormsModule,
    PfCommonModule,
    PfCommonUIModule,
    PfApiModule,
    PfFormsModule,
    FontAwesomeModule,
    NgbModule,
    ComboBoxModule

  ],
  declarations: [
    // Containers
    SurveyComponent,
    AddSurveyModalComponent,
    AddSurveyTitleModalComponent,
    SurveyTitlesPageComponent,
    SurveyTitleListItemComponent,
    MapCompanyModalComponent,
    CustomSurveyTitleComponent,
    SurveyTitleCompaniesListComponent,
    ExpandCollapseIconComponent,

    // Directives
    CollapserDirective
  ],
  providers: [
    SurveyLibraryApiService,
    SurveyLibraryStateService
  ]
})

export class SurveyLibraryModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
