import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DragulaModule } from 'ng2-dragula';
import { QuillModule } from 'ngx-quill';

import { JobDescriptionManagementService, JobDescriptionManagementDnDService } from 'libs/features/jobs/job-description-management/services';
import { PfCommonModule } from 'libs/core';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';

import {
  CompanyFlsaStatusEffects,
  CompanyLogoEffects,
  ControlTypesEffects,
  JobDescriptionAppliesToEffects,
  JobDescriptionLibraryEffects,
  JobFamilyEffects,
  SharedWorkflowEffects,
  TemplateListEffects,
  WorkflowConfigEffects
} from 'libs/features/jobs/job-description-management/effects';
import {
  JobDescriptionSectionComponent,
  JobDescriptionControlComponent,
  ControlDataRendererComponent,
  SingleEditorComponent,
  ListEditorComponent,
  SmartListEditorComponent,
  ControlDataAttributeRendererComponent,
  SmartListEditorDataTableComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('jobDescriptionManagement_shared', reducers),
    EffectsModule.forFeature([
      CompanyFlsaStatusEffects,
      CompanyLogoEffects,
      ControlTypesEffects,
      JobDescriptionAppliesToEffects,
      JobDescriptionLibraryEffects,
      JobFamilyEffects,
      SharedWorkflowEffects,
      TemplateListEffects,
      WorkflowConfigEffects
    ]),
    FontAwesomeModule,
    DragulaModule.forRoot(),
    QuillModule.forRoot(),

    PfCommonModule
  ],
  declarations: [
    JobDescriptionSectionComponent,
    JobDescriptionControlComponent,
    ControlDataRendererComponent,
    SingleEditorComponent,
    ListEditorComponent,
    SmartListEditorComponent,
    ControlDataAttributeRendererComponent,
    SmartListEditorDataTableComponent
  ],
  exports: [
    JobDescriptionSectionComponent,
    JobDescriptionControlComponent,
    ControlDataRendererComponent,
    SingleEditorComponent,
    ListEditorComponent,
    SmartListEditorComponent,
    ControlDataAttributeRendererComponent,
    SmartListEditorDataTableComponent
  ],
  providers: [
    JobDescriptionManagementService,
    JobDescriptionManagementDnDService
  ]
})
export class PfJobDescriptionManagementModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
