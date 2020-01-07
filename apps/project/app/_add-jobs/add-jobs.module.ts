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
import { JobLimitCounterComponent } from 'libs/features/smallbiz';

import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';
import { SavedFiltersHelper } from 'libs/features/add-jobs/helpers';
import { JobSearchUserFilterType, SearchFilterMappingData } from 'libs/features/add-jobs/data';

import * as fromFaIcons from './fa-icons';
import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { reducers } from './reducers';
import { AddJobsPageEffects, SearchResultsEffects, SearchFiltersEffects, SingledFilterEffects, PaymarketEffects,
         CreateNewJobPageEffects, JobSearchUserFilterEffects } from './effects';
import { AddJobsPageComponent, SearchResultsComponent, PaymarketsComponent, CreateNewJobPageComponent } from './containers';
import { JobResultComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addJobs', reducers),
    EffectsModule.forFeature([
      AddJobsPageEffects,
      CreateNewJobPageEffects,
      SearchResultsEffects,
      SearchFiltersEffects,
      SingledFilterEffects,
      PaymarketEffects,
      JobSearchUserFilterEffects
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
    PfFormsModule
  ],
  declarations: [
    // Components
    SearchResultsComponent,
    JobLimitCounterComponent,
    JobResultComponent,

    // Containers
    PaymarketsComponent,

    // Pages
    AddJobsPageComponent, CreateNewJobPageComponent
  ],
  providers: [
    SavedFiltersHelper,
    { provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData },
    { provide: UserFilterTypeData, useValue: JobSearchUserFilterType }
  ]
})
export class AddJobsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
