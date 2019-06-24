import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnResizingService, FilterMenuModule, GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import { JobDescriptionRoutingModule } from './job-description-routing.module';
import { JobDescriptionListPageComponent } from './containers/pages/job-description-list/job-description-list.page';
import {
  AssignJobsToTemplateModalComponent,
  BulkExportPopoverComponent,
  ColumnSelectorPopoverComponent,
  FilterSelectorPopoverComponent, JobDescriptionGridComponent, JobInformationFieldsComponent
} from './components';
import { JobDescriptionHistoryModalComponent } from './components/modals/job-description-history/job-description-history-modal.component';
import { SaveFilterModalComponent } from './components/modals/save-filter/save-filter-modal.component';
import { SharedModule } from '../shared/shared.module';
import { PublicViewHeaderComponent } from './components/public-view-header/public-view-header.component';
import { ListAreaService } from '../shared/services/list-area.service';
import { reducers } from './reducers';
import {
  BulkExportPopoverEffects,
  JobDescriptionEffects,
  JobDescriptionGridEffects,
  JobInformationFieldsEffects,
  UserFilterEffects
} from './effects';
import { JobDescriptionHistoryListEffects } from './effects/job-description-history-list.effects';
import { PublicViewHeaderEffects } from './effects/public-view-header.effects';
import { ListAreaColumnSearchPipe } from './pipes/list-area-column-search.pipe';
import { JobDescriptionAppliesToDisplayNamePipe, UserFilterSearchPipe } from './pipes';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('jobDescriptionManagement_jobDescription', reducers),
    EffectsModule.forFeature([
      BulkExportPopoverEffects,
      JobDescriptionEffects,
      JobDescriptionGridEffects,
      JobDescriptionHistoryListEffects,
      JobInformationFieldsEffects,
      PublicViewHeaderEffects,
      UserFilterEffects
    ]),
    LayoutModule,

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
    PfJobDescriptionManagementModule
  ],
  declarations: [
    // Components
    AssignJobsToTemplateModalComponent,
    BulkExportPopoverComponent,
    ColumnSelectorPopoverComponent,
    FilterSelectorPopoverComponent,
    JobDescriptionGridComponent,
    JobInformationFieldsComponent,
    JobDescriptionHistoryModalComponent,
    PublicViewHeaderComponent,
    SaveFilterModalComponent,

    // Pages
    JobDescriptionListPageComponent,

    // Pipes
    JobDescriptionAppliesToDisplayNamePipe,
    ListAreaColumnSearchPipe,
    UserFilterSearchPipe
  ],
  providers: [
    ListAreaService, ColumnResizingService
  ]
})
export class JobDescriptionModule { }








