import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';

import * as fromFaIcons from './fa-icons';
import { JobResultComponent } from './components';
import { JobSearchUserFilterType, SearchFilterMappingData } from './data';
import { SavedFiltersHelper } from './helpers';
import { reducers } from './reducers';
import { AddJobsModalEffects, JobSearchUserFilterEffects, PaymarketEffects } from './effects';
import { PaymarketsComponent } from './containers/paymarkets';
import { JobLimitCounterComponent } from '../smallbiz/job-limit-counter';
import { SearchResultsComponent } from './containers/search-results';
import { AddJobsPageComponent } from './containers/pages/add-jobs';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('addJobs_reducers', reducers),
    EffectsModule.forFeature([
      PaymarketEffects,
      AddJobsModalEffects,
      JobSearchUserFilterEffects
    ]),
    InfiniteScrollModule,
    DropDownsModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobResultComponent,
    JobLimitCounterComponent,

    // Containers
    PaymarketsComponent,
    SearchResultsComponent,

    // Pages
    AddJobsPageComponent
  ],
  exports: [
    JobResultComponent,
    PaymarketsComponent,
    JobLimitCounterComponent,
    PfSearchModule,
    SearchResultsComponent,
    AddJobsPageComponent
  ],
  providers: [
    SavedFiltersHelper,
    {provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData},
    {provide: UserFilterTypeData, useValue: JobSearchUserFilterType}
  ]
})
export class PfAddJobsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
