import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import {PfFormsModule} from 'libs/forms';

import {SharedModule} from '../shared/shared.module';
import * as fromFaIcons from '../_templates/fa-icons';
import {ErrorGenerationService} from '../shared/services';
import {TemplatesRoutingModule} from './templates-routing.module';
import { TemplatePageComponent, TemplateListPageComponent } from './containers';
import {
  TemplateListComponent,
  TemplateActionsComponent,
  CopyTemplateModalComponent,
  AssignTemplateToJobModalComponent,
  NewTemplateModalComponent } from './components';
import { reducers } from './reducers';
import {
  TemplateListEffects,
  TemplateEffects,
  CompanyJobAssignmentEffects
} from './effects';
import { CompanyJobSearchPipe } from './pipes';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    NgbTabsetModule,
    StoreModule.forFeature('jobDescriptionManagement_jobDescriptionTemplates', reducers),
    EffectsModule.forFeature([
      TemplateEffects,
      TemplateListEffects,
      CompanyJobAssignmentEffects
    ]),

    // Routing
    TemplatesRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // 3rd Party
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    PfJobDescriptionManagementModule,
    FontAwesomeModule,
  ],
  declarations: [
    // Components
    CopyTemplateModalComponent,
    NewTemplateModalComponent,
    TemplateListComponent,

    // Pages
    TemplateListPageComponent,
    AssignTemplateToJobModalComponent,
    TemplatePageComponent,
    TemplateActionsComponent,

    // Pipes
    CompanyJobSearchPipe
  ],
  providers: [
    // Services
    JobDescriptionTemplateApiService,
    ErrorGenerationService,
  ],
  exports: [
    TemplatePageComponent
  ]
})
export class TemplatesModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
