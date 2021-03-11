import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';

import { PfSearchModule } from 'libs/features/search/search';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';

import * as fromFaIcons from './fa-icons';
import { AddJobsToRangePageComponent } from './containers/pages/add-jobs-to-range/add-jobs-to-range.page';
import { GradeRangeJobResultComponent } from './components/grade-range-job-result/grade-range-job-result.component';
import { StructuresSearchResultsComponent } from './containers/structures-search-results/structures-search-results.component';
import { JobsToGradeContainerComponent } from './containers/jobs-to-grade-container';
import { JobToGradeComponent } from './components/job-to-grade';
import { reducers } from './reducers';
import { JobsToGradeEffects } from './effects';
import { RangeValuePipe } from './pipes';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_addJobsToRange', reducers),
    EffectsModule.forFeature([JobsToGradeEffects]),
    DragulaModule.forRoot(),
    InfiniteScrollModule,
    DropDownsModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,
    GridModule,

    // Payfactors
    PfSearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfAddJobsModule

  ],
  declarations: [
    AddJobsToRangePageComponent,
    GradeRangeJobResultComponent,
    StructuresSearchResultsComponent,
    JobsToGradeContainerComponent,
    JobToGradeComponent,
    RangeValuePipe],
  exports: [AddJobsToRangePageComponent, RangeValuePipe],
  providers: []
})
export class PfAddJobsToRangeModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }

}
