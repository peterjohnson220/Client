import { NgModule } from '@angular/core';

import { library } from '@fortawesome/fontawesome-svg-core';

import * as fromFaIcons from './fa-icons';
import { SurveyComponent } from './containers/survey/survey.component';
import { SurveyLibraryRoutingModule } from './survey-library-routing.module';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfApiModule } from 'libs/data/payfactors-api';
import { PfCommonModule } from 'libs/core';
import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PfFormsModule } from 'libs/forms';
import { AddSurveyModalComponent } from './containers/add-survey-modal/add-survey-modal.component';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyLibraryStateService } from './services/survey-library-state.service';
import { AddSurveyTitleModalComponent, SurveyTitlesPageComponent } from './containers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // routing
    SurveyLibraryRoutingModule,

    // 3rd party
    NgbPopoverModule,
    NgbTooltipModule,

    // PF Modules
    PfFormsModule,
    PfCommonModule,
    PfCommonUIModule,
    PfApiModule,
    PfFormsModule
  ],
  declarations: [
    // Containers
    SurveyComponent,
    AddSurveyModalComponent,
    SurveyTitlesPageComponent,
    AddSurveyTitleModalComponent
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
