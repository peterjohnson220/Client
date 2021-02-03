import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfSearchModule } from 'libs/features/search/search';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';

import * as fromFaIcons from './fa-icons';
import { AddJobsToRangePageComponent } from './containers/pages/add-jobs-to-range/add-jobs-to-range.page';
import { GradeRangeJobResultComponent } from './components/grade-range-job-result/grade-range-job-result.component';
import { StructuresSearchResultsComponent } from './containers/structures-search-results/structures-search-results.component';



@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    InfiniteScrollModule,
    DropDownsModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfAddJobsModule

  ],
  declarations: [AddJobsToRangePageComponent, GradeRangeJobResultComponent, StructuresSearchResultsComponent],
  exports: [AddJobsToRangePageComponent],
  providers: []
})
export class PfAddJobsToRangeModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }

}
