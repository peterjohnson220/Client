import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import {PfFormsModule} from 'libs/forms';

import {TemplatesRoutingModule} from './templates-routing.module';
import {TemplateListPageComponent} from './containers/pages/template-list';
import { reducers } from './reducers';
import {
  TemplateListEffects,
  TemplateEffects
} from './effects';
import {SharedModule} from '../shared/shared.module';
import {TemplateListComponent} from './components/template-list';
import {CopyTemplateModalComponent} from './components/modals/copy-template';
import {NewTemplateModalComponent} from './components/modals/new-template';
import * as fromFaIcons from '../_templates/fa-icons';
import {ErrorGenerationService} from '../shared/services';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_jobDescriptionTemplates',
      reducers),
    EffectsModule.forFeature([
      TemplateEffects,
      TemplateListEffects
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
    TemplateListPageComponent
  ],
  providers: [
    JobDescriptionTemplateApiService,
    ErrorGenerationService
  ]
})
export class TemplatesModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
