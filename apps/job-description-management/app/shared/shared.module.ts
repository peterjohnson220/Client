import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule, FilterMenuModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DragulaModule } from 'ng2-dragula';
import { EditorModule } from 'primeng/editor';
import { NgbTabsetModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import * as fromFaIcons from './fa-icons';
import {
  JobDescriptionAppliesToModalComponent,
  JobDescriptionInfoHeaderNoLogoComponent,
  ListAreaFilterBooleanComponent,
  ListAreaFilterDateComponent,
  ListAreaFilterNumberComponent,
  ListAreaFilterPillsComponent,
  ListAreaFilterSidebarComponent,
  ListAreaFilterTextComponent,
  StatusPillComponent,
  ControlDataAttributeRendererComponent,
  ControlDataRendererComponent,
  ListEditorComponent,
  SingleEditorComponent,
  SmartListEditorComponent,
  SmartListEditorDataTableComponent,
  JobDescriptionInfoHeaderWithLogoComponent,
  SaveErrorModalComponent,
  ConflictErrorModalComponent,
  JobDescriptionLibraryComponent,
  UserRoutingSelectorComponent,
  WorkflowStepCompletionPageComponent,
  DeleteJobDescriptionModalComponent,
  CopyTemplateModalComponent
} from './components';
import {
  WorkflowConfigComponent
} from './containers';
import { ListAreaService, JobDescriptionManagementService, JobDescriptionManagementDnDService } from 'libs/features/job-description-management/services';
import { reducers } from 'libs/features/job-description-management/reducers';
import {
  CompanyFlsaStatusEffects,
  ControlTypesEffects,
  JobDescriptionLibraryEffects,
  JobDescriptionAppliesToEffects,
  JobFamilyEffects,
  TemplateListEffects,
  SharedWorkflowEffects,
  WorkflowConfigEffects,
  CompanyLogoEffects
} from './effects';
import { JobDescriptionAppliesToDisplayNamePipe } from './pipes';
import { PeditorAutoFocusFixDirective } from './directives';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_shared', reducers),
    EffectsModule.forFeature([
      CompanyFlsaStatusEffects,
      JobDescriptionAppliesToEffects,
      JobFamilyEffects,
      ControlTypesEffects,
      TemplateListEffects,
      JobDescriptionLibraryEffects,
      SharedWorkflowEffects,
      WorkflowConfigEffects,
      CompanyLogoEffects
    ]),
    FontAwesomeModule,
    PfJobDescriptionManagementModule,
    DragulaModule.forRoot(),
    EditorModule,
    NgbTabsetModule,
    NgbPaginationModule,
    NgbTooltipModule,
    ImgFallbackModule,
    GridModule,
    DropDownsModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    FilterMenuModule,
    GridModule
  ],
  exports: [
    StatusPillComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    JobDescriptionAppliesToModalComponent,
    JobDescriptionInfoHeaderNoLogoComponent,
    JobDescriptionInfoHeaderWithLogoComponent,
    ControlDataRendererComponent,
    ConflictErrorModalComponent,
    SaveErrorModalComponent,
    JobDescriptionLibraryComponent,
    UserRoutingSelectorComponent,
    WorkflowStepCompletionPageComponent,
    WorkflowConfigComponent,
    DeleteJobDescriptionModalComponent,
    CopyTemplateModalComponent
  ],
  declarations: [
    // Components
    ListAreaFilterBooleanComponent,
    ListAreaFilterDateComponent,
    ListAreaFilterNumberComponent,
    ListAreaFilterPillsComponent,
    ListAreaFilterSidebarComponent,
    ListAreaFilterTextComponent,
    ConflictErrorModalComponent,
    SaveErrorModalComponent,
    StatusPillComponent,
    JobDescriptionAppliesToModalComponent,
    JobDescriptionInfoHeaderNoLogoComponent,
    JobDescriptionInfoHeaderWithLogoComponent,
    ControlDataAttributeRendererComponent,
    ControlDataRendererComponent,
    ListEditorComponent,
    SingleEditorComponent,
    SmartListEditorComponent,
    SmartListEditorDataTableComponent,
    JobDescriptionLibraryComponent,
    UserRoutingSelectorComponent,
    WorkflowStepCompletionPageComponent,
    DeleteJobDescriptionModalComponent,
    CopyTemplateModalComponent,

    // Containers
    WorkflowConfigComponent,

    // Pipes
    JobDescriptionAppliesToDisplayNamePipe,

    // Directives
    PeditorAutoFocusFixDirective
  ],
  providers: [
    ListAreaService,
    JobDescriptionManagementService,
    JobDescriptionManagementDnDService
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








