import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule, NgbTooltipModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/jobs/job-description-management/job-description-management.module';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';
import { PfFormsModule } from 'libs/forms';

import * as fromFaIcons from '../fa-icons';
import { SharedModule } from '../../shared/shared.module';
import { ErrorGenerationService } from 'libs/features/jobs/job-description-management/services';
import { TemplatePageComponent } from './template.page';
import { CompanyJobSearchPipe } from './pipes';
import {
  TemplateEffects,
  AvailableJobInformationFieldsEffects,
  CompanyJobAssignmentEffects,
  TemplateSettingEffects } from './effects';
import { reducers } from './reducers';
import {
  TemplateInlineComponent,
  TemplateActionsComponent,
  AssignTemplateToJobModalComponent,
  ControlContainerComponent,
  TemplateJobInformationSectionComponent,
  FieldSelectorPopoverComponent,
  TemplateSectionComponent,
  ConfirmPublishTemplateModalComponent,
  NewSectionModalComponent,
  ConfirmSectionDeleteModalComponent,
  EditSectionModalComponent,
  ConfirmControlDeleteModalComponent,
  UpsertControlModalComponent,
  SelectTemplateLogoModalComponent,
 } from './components';
  import { TemplateControlComponent, } from './containers';
import { TemplateDnDService, TemplateService } from './services';

@NgModule({
    imports: [
        // Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,

        // 3rd Party
        StoreModule.forFeature('jobDescriptionManagement_jobDescriptionTemplate', reducers),
        EffectsModule.forFeature([
            TemplateEffects,
            AvailableJobInformationFieldsEffects,
            CompanyJobAssignmentEffects,
            TemplateSettingEffects
        ]),
        NgbPopoverModule,
        NgbTooltipModule,
        UploadModule,
        DragulaModule.forRoot(),

        // Payfactors
        PfCommonModule,
        PfCommonUIModule,
        PfFormsModule,
        SharedModule,
        PfJobDescriptionManagementModule,
        NgbModule,
    ],
  declarations: [
    // Components
    TemplateInlineComponent,
    AssignTemplateToJobModalComponent,
    TemplateActionsComponent,
    ControlContainerComponent,
    TemplateJobInformationSectionComponent,
    FieldSelectorPopoverComponent,
    TemplateSectionComponent,
    TemplateControlComponent,
    ConfirmPublishTemplateModalComponent,
    NewSectionModalComponent,
    ConfirmSectionDeleteModalComponent,
    EditSectionModalComponent,
    ConfirmControlDeleteModalComponent,
    UpsertControlModalComponent,
    SelectTemplateLogoModalComponent,

    // Pages
    TemplatePageComponent,

    // Pipes
    CompanyJobSearchPipe,

  ],
  providers: [
    // Services
    JobDescriptionTemplateApiService,
    ErrorGenerationService,
    TemplateDnDService,
    TemplateService
  ],
  exports: [
    TemplatePageComponent
  ]
})
export class TemplateModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
