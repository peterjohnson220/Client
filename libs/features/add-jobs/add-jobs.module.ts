import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfSearchModule } from 'libs/features/search';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';
import { UserFilterTypeData } from 'libs/features/user-filter/models';

import * as fromFaIcons from './fa-icons';
import { JobBasedRangesAddJobsModalComponent } from './components';
import { JobSearchUserFilterType, SearchFilterMappingData } from './data';
import { SavedFiltersHelper } from './helpers';

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

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    JobBasedRangesAddJobsModalComponent

    // Containers
  ],
  exports: [
    JobBasedRangesAddJobsModalComponent
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
