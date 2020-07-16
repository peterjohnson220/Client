import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { MomentModule } from 'ngx-moment';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { PfCommonModule } from 'libs/core';
import { PfApiModule, SurveyLibraryApiService } from 'libs/data/payfactors-api';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import * as fromFaIcons from './fa-icons';
import { SurveyComponent } from './containers/survey/survey.component';
import { SurveyLibraryRoutingModule } from './survey-library-routing.module';
import { AddSurveyModalComponent } from './containers/add-survey-modal/add-survey-modal.component';
import { SurveyLibraryStateService } from './services/survey-library-state.service';
import {
    AddSurveyTitleModalComponent, CustomSurveyTitleComponent, MapCompanyModalComponent, SurveyTitleListItemComponent,
    SurveyTitlesPageComponent, SurveyNotesModalComponent
} from './containers';
import { ExpandCollapseIconComponent, SurveyTitleCompaniesListComponent, SurveyNotesListComponent } from './components';
import { CollapserDirective } from './directives';
import { reducers } from './reducers';
import { CompanySelectorEffects, SurveyEffects, SurveyTitlesEffects, SurveyNotesEffects } from './effects';
import { CopySurveyModalComponent } from './containers/copy-survey-modal/copy-survey-modal.component';
import { DeleteConfirmationModalComponent } from './containers/delete-confirmation-modal/delete-confirmation-modal.component';

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
      SurveyEffects,
      SurveyNotesEffects
    ]),
    NgbPopoverModule,
    NgbTooltipModule,
    NgbModule,
    FontAwesomeModule,
    ImgFallbackModule,
    MomentModule,

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
    CopySurveyModalComponent,
    DeleteConfirmationModalComponent,
    SurveyNotesModalComponent,
    SurveyNotesListComponent,

    // Directives
    CollapserDirective
  ],
  providers: [
    SurveyLibraryApiService,
    SurveyLibraryStateService
  ]
})

export class SurveyLibraryModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
