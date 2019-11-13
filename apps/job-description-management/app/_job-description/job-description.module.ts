import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MomentModule } from 'angular2-moment';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnResizingService, FilterMenuModule, GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DragulaModule } from 'ng2-dragula';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import * as fromFaIcons from './fa-icons';
import { JobDescriptionRoutingModule } from './job-description-routing.module';
import {
  JobDescriptionJobComparePageComponent,
  JobDescriptionListPageComponent,
  JobDescriptionVersionComparePageComponent,
  JobDescriptionPageComponent,
  JobDescriptionActionsComponent,
  WorkflowWatchSidebarComponent,
  JobDescriptionHistoryGridComponent,
  JobMatchesModalComponent,
  CopyJobDescriptionModalComponent,
  WorkflowSidebarComponent,
  ChangeApproverModalComponent,
  WorkflowSetupModalComponent
} from './containers';
import {
  AddJobModalComponent,
  AssignJobsToTemplateModalComponent,
  BulkExportPopoverComponent,
  ColumnSelectorPopoverComponent,
  FilterSelectorPopoverComponent,
  JobDescriptionGridComponent,
  JobInformationFieldsComponent,
  CompareVersionSelectorComponent,
  JobDescriptionCompareControlResultComponent,
  JobDescriptionCompareDataResultComponent,
  JobDescriptionCompareSectionResultComponent,
  JobDescriptionSectionComponent,
  CompareJobSelectorComponent,
  JobDescriptionControlComponent,
  JobDescriptionHistoryModalComponent,
  PublicViewHeaderComponent,
  SaveFilterModalComponent,
  WorkflowLogComponent,
  WorkflowProgressBarComponent,
  EmployeeAcknowledgementModalComponent,
  WorkflowCancelModalComponent,
  FlsaQuestionnaireModalComponent,
  JobMatchResultComponent,
  ExportJobDescriptionModalComponent
} from './components';
import { reducers } from './reducers';
import {
  AddJobModalEffects,
  BulkExportPopoverEffects,
  JobDescriptionEffects,
  JobDescriptionGridEffects,
  JobDescriptionHistoryListEffects,
  JobInformationFieldsEffects,
  PublicViewHeaderEffects,
  UserFilterEffects,
  JobDescriptionVersionCompareEffects,
  JobDescriptionJobCompareEffects,
  JobMatchesEffects,
  WorkflowEffects,
  EmployeeAcknowledgementEffects,
  FlsaQuestionnaireModalEffects,
  CopyJobDescriptionModalEffects,
  JobDescriptionListEffects,
  WorkflowSetupModalEffects
} from './effects';
import { ListAreaColumnSearchPipe, UserFilterSearchPipe } from './pipes';
import { JobDescriptionDnDService, JobDescriptionJobCompareService, JobDescriptionVersionCompareService } from './services';
import { ResolveHistoryListGuard, JobDescriptionJobCompareListResolver } from './guards';
import { SharedModule } from '../shared/shared.module';
import { ListAreaService } from '../shared/services';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_jobDescription', reducers),
    EffectsModule.forFeature([
      AddJobModalEffects,
      BulkExportPopoverEffects,
      JobDescriptionEffects,
      JobDescriptionGridEffects,
      JobDescriptionHistoryListEffects,
      JobInformationFieldsEffects,
      PublicViewHeaderEffects,
      UserFilterEffects,
      JobDescriptionJobCompareEffects,
      JobDescriptionVersionCompareEffects,
      JobMatchesEffects,
      WorkflowEffects,
      EmployeeAcknowledgementEffects,
      FlsaQuestionnaireModalEffects,
      CopyJobDescriptionModalEffects,
      JobDescriptionListEffects,
      WorkflowSetupModalEffects
    ]),
    LayoutModule,
    SharedModule,
    DragulaModule.forRoot(),

    // Routing
    JobDescriptionRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,

    // 3rd Party
    ReactiveFormsModule,
    FormsModule,
    DropDownsModule,
    NgbPopoverModule,
    GridModule,
    NgbDropdownModule,
    FilterMenuModule,
    SharedModule,
    FontAwesomeModule,
    PfJobDescriptionManagementModule,
    NgbTabsetModule,
    MomentModule,
  ],
  declarations: [
    // Components
    AddJobModalComponent,
    AssignJobsToTemplateModalComponent,
    BulkExportPopoverComponent,
    ColumnSelectorPopoverComponent,
    FilterSelectorPopoverComponent,
    JobDescriptionGridComponent,
    JobInformationFieldsComponent,
    JobDescriptionHistoryModalComponent,
    PublicViewHeaderComponent,
    SaveFilterModalComponent,
    JobDescriptionSectionComponent,
    CompareVersionSelectorComponent,
    CompareJobSelectorComponent,
    JobDescriptionCompareControlResultComponent,
    JobDescriptionCompareDataResultComponent,
    JobDescriptionCompareSectionResultComponent,
    JobDescriptionControlComponent,
    WorkflowLogComponent,
    EmployeeAcknowledgementModalComponent,
    WorkflowCancelModalComponent,
    FlsaQuestionnaireModalComponent,
    JobMatchResultComponent,
    ExportJobDescriptionModalComponent,
    WorkflowProgressBarComponent,

    // Pages
    JobDescriptionJobComparePageComponent,
    JobDescriptionListPageComponent,
    JobDescriptionVersionComparePageComponent,
    JobDescriptionPageComponent,
    WorkflowWatchSidebarComponent,

    // Containers
    JobDescriptionActionsComponent,
    JobDescriptionHistoryGridComponent,
    JobMatchesModalComponent,
    CopyJobDescriptionModalComponent,
    WorkflowSidebarComponent,
    ChangeApproverModalComponent,
    WorkflowSetupModalComponent,

    // Pipes
    ListAreaColumnSearchPipe,
    UserFilterSearchPipe
  ],
  providers: [
    ListAreaService, ColumnResizingService, JobDescriptionVersionCompareService, JobDescriptionJobCompareService,
    ResolveHistoryListGuard, JobDescriptionJobCompareListResolver, JobDescriptionDnDService
  ]
})
export class JobDescriptionModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}








