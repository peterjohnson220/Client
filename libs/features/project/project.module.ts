import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { library } from '@fortawesome/fontawesome-svg-core';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';

import * as fromFaIcons from './fa-icons';
import { AddJobsStructuresModelingModalComponent } from './components';
import { JobSearchUserFilterType, SearchFilterMappingData } from './data';
import { SavedFiltersHelper } from './helpers';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule, ReactiveFormsModule,

    // 3rd Party
    InfiniteScrollModule,
    DropDownsModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,
    StoreModule.forFeature('projects_state', reducers),

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    AddJobsStructuresModelingModalComponent

    // Containers

  ],
  exports: [
    AddJobsStructuresModelingModalComponent
  ],
  providers: [
    SavedFiltersHelper,
    {provide: SearchFilterMappingDataObj, useValue: SearchFilterMappingData},
    {provide: UserFilterTypeData, useValue: JobSearchUserFilterType}
  ]
})
export class PfProjectModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
