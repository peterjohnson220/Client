import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';

import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';
import { SavedFiltersHelper } from 'libs/features/add-jobs/helpers';
import { JobSearchUserFilterType, SearchFilterMappingData } from 'libs/features/add-jobs/data';
import { PfAddJobsModule } from 'libs/features/add-jobs';

import * as fromFaIcons from './fa-icons';
import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { reducers } from './reducers';
import {
  AddJobsPageEffects,
  CreateNewJobPageEffects,
  SearchFiltersEffects,
  SingledFilterEffects
} from './effects';
import { AddJobsPageComponent, SearchResultsComponent, CreateNewJobPageComponent } from './containers';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addJobs', reducers),
    EffectsModule.forFeature([
      AddJobsPageEffects,
      CreateNewJobPageEffects,
      SearchFiltersEffects,
      SingledFilterEffects
    ]),
    InfiniteScrollModule,
    DropDownsModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,

    // Routing
    AddJobsRoutingModule,

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfAddJobsModule
  ],
  declarations: [
    // Components
    SearchResultsComponent,

    // Pages
    AddJobsPageComponent, CreateNewJobPageComponent
  ],
  providers: [
    SavedFiltersHelper,
    {provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData},
    {provide: UserFilterTypeData, useValue: JobSearchUserFilterType}
  ]
})
export class AddJobsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
