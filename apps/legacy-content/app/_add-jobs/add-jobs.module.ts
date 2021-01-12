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
import { PfSearchModule } from 'libs/features/search/search';

import { SearchFilterMappingDataObj } from 'libs/features/search/search/models';
import { UserFilterPopoverConfig, UserFilterTypeData } from 'libs/features/users/user-filter/models';
import { SavedFiltersHelper } from 'libs/features/jobs/add-jobs/helpers';
import { JobSearchUserFilterType, SearchFilterMappingData } from 'libs/features/jobs/add-jobs/data';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';

import * as fromFaIcons from './fa-icons';
import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { reducers } from './reducers';
import {
  AddJobsPageEffects,
  CreateNewJobPageEffects,
  SearchFiltersEffects,
  SearchResultsEffects,
  SingledFilterEffects
} from './effects';
import { CreateNewJobPageComponent } from './containers';
import { AddJobsUserFilterPopoverConfig } from './data';

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
      SearchResultsEffects,
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
    // Pages
    CreateNewJobPageComponent
  ],
  providers: [
    SavedFiltersHelper,
    {provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig}
  ]
})
export class AddJobsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
