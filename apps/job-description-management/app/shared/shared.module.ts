import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComboBoxModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { GridModule, FilterMenuModule } from '@progress/kendo-angular-grid';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragulaModule } from 'ng2-dragula';
import { EditorModule } from 'primeng/editor';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import * as fromFaIcons from './fa-icons';
import {
  JobDescriptionAppliesToModalComponent,
  JobDescriptionInfoHeaderNoLogoComponent,
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
  SimpleYesNoModalComponent
} from './components';
import { ListAreaService, JobDescriptionManagementService, JobDescriptionManagementDnDService } from './services';
import { reducers } from './reducers';
import {
  CompanyFlsaStatusEffects,
  ControlTypesEffects,
  JobDescriptionLibraryEffects,
  JobDescriptionAppliesToEffects,
  JobFamilyEffects,
  TemplateListEffects
} from './effects';
import { JobDescriptionAppliesToDisplayNamePipe } from './pipes';


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
      JobDescriptionLibraryEffects
    ]),
    FontAwesomeModule,
    PfJobDescriptionManagementModule,
    DragulaModule.forRoot(),
    EditorModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    ReactiveFormsModule,
    ComboBoxModule,
    DropDownsModule,
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
    SimpleYesNoModalComponent
  ],
  declarations: [
    // Components
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
    SimpleYesNoModalComponent,

    // Pipes
    JobDescriptionAppliesToDisplayNamePipe
  ],
  providers: [
    ListAreaService,
    JobDescriptionManagementService,
    JobDescriptionManagementDnDService
  ]
})
export class SharedModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}








