import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule, FilterMenuModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { DragulaModule } from 'ng2-dragula';
import { EditorModule } from 'primeng/editor';
import { NgbTabsetModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ImgFallbackModule } from 'ngx-img-fallback';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/jobs/job-description-management/job-description-management.module';

import * as fromFaIcons from './fa-icons';
import {
  JobDescriptionAppliesToModalComponent,
  JobDescriptionInfoHeaderNoLogoComponent,
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

import { JobDescriptionAppliesToDisplayNamePipe } from './pipes';
import { PeditorAutoFocusFixDirective } from './directives';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
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
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








