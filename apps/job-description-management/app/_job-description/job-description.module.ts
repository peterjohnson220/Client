import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbDropdownModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterMenuModule, GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { JobDescriptionRoutingModule } from './job-description-routing.module';
import { JobDescriptionListPageComponent } from './containers/pages/job-description-list.page';
import {
  AssignJobsToTemplateModalComponent,
  BulkExportPopoverComponent,
  ColumnSelectorPopoverComponent,
  FilterSelectorPopoverComponent, JobDescriptionGridComponent, JobInformationFieldsComponent
} from './components';
import { JobDescriptionHistoryModalComponent } from './components/job-description-history-modal.component';
import { SaveFilterModalComponent } from './components/save-filter-modal.component';
import { SharedModule } from '../shared/shared.module';
import { PublicViewHeaderComponent } from './components/public-view-header.component';
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
    SharedModule
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
    ListAreaService
  ]
})
export class JobDescriptionModule { }








