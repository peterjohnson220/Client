import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management';

import * as fromFaIcons from '../fa-icons';
import {SharedModule} from '../../shared/shared.module';
import { ErrorGenerationService } from 'libs/features/job-description-management';
import { reducers } from './reducers';
import { TemplateListPageComponent } from './template-list.page';
import { TemplateListEffects } from './effects';
import { NewTemplateModalComponent, TemplateListComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_jobDescriptionTemplateList', reducers),
    EffectsModule.forFeature([
      TemplateListEffects
    ]),
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    SharedModule,
    PfJobDescriptionManagementModule,
  ],
  declarations: [
    // Components
    NewTemplateModalComponent,
    TemplateListComponent,

    // Pages
    TemplateListPageComponent,
  ],
  providers: [
    // Services
    JobDescriptionTemplateApiService,
    ErrorGenerationService,
  ],
  exports: [
    TemplateListPageComponent
  ]
})
export class TemplateListModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
