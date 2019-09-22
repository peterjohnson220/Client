import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbDropdownModule, NgbPopoverModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnResizingService, FilterMenuModule, GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfJobDescriptionManagementModule } from 'libs/features/job-description-management/job-description-management.module';

import { JobDescriptionRoutingModule } from './job-description-routing.module';
import {
  JobDescriptionListPageComponent, JobDescriptionVersionComparePageComponent
} from './containers/pages';
import {
  AddJobModalComponent,
  AssignJobsToTemplateModalComponent,
  BulkExportPopoverComponent,
  ColumnSelectorPopoverComponent,
  FilterSelectorPopoverComponent, JobDescriptionGridComponent, JobInformationFieldsComponent,
  CompareVersionSelectorComponent, JobDescriptionCompareControlResultComponent, JobDescriptionCompareDataResultComponent,
  JobDescriptionCompareSectionResultComponent, JobDescriptionSectionComponent
} from './components';
import { JobDescriptionHistoryModalComponent } from './components/modals/job-description-history/job-description-history-modal.component';
import { SaveFilterModalComponent } from './components/modals/save-filter/save-filter-modal.component';
import { SharedModule } from '../shared/shared.module';
import { PublicViewHeaderComponent } from './components/public-view-header/public-view-header.component';
import { ListAreaService } from '../shared/services/list-area.service';
import { reducers } from './reducers';
import {
  AddJobModalEffects,
  BulkExportPopoverEffects,
  JobDescriptionEffects,
  JobDescriptionGridEffects, JobDescriptionHistoryListEffects,
  JobInformationFieldsEffects, PublicViewHeaderEffects,
  UserFilterEffects
} from './effects';
import { ListAreaColumnSearchPipe } from './pipes/list-area-column-search.pipe';
import { UserFilterSearchPipe } from './pipes';
import {JobDescriptionVersionCompareService} from './services/job-description-version-compare.service';
import {JobDescriptionApiService} from './services/job-description-api.service';
import {ResolveHistoryListGuard} from './guards/resolve-history-list.guard';
import {JobDescriptionJobCompareListResolver} from './guards/resolve-job-description-compare-list.guard';
import * as fromFaIcons from '../../../job-description-management/app/_job-description/fa-icons';
import { JobDescriptionVersionCompareEffects } from './effects/job-description-version-compare.effects';
import { CompareJobSelectorComponent } from './components/job-compare/compare-job-selector.component';



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
      JobDescriptionVersionCompareEffects
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
    PfJobDescriptionManagementModule,
    NgbTabsetModule
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

    // Pages
    JobDescriptionListPageComponent,
    JobDescriptionVersionComparePageComponent,

    // Pipes
    ListAreaColumnSearchPipe,
    UserFilterSearchPipe
  ],
  providers: [
    ListAreaService, ColumnResizingService , JobDescriptionVersionCompareService, JobDescriptionApiService,
    ResolveHistoryListGuard, JobDescriptionJobCompareListResolver
  ]
})
export class JobDescriptionModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}








