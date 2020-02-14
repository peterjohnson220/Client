import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfAddJobsModule } from 'libs/features/add-jobs';
import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { UserFilterPopoverConfig } from 'libs/features/user-filter/models';

import { AddJobsModalComponent, AddJobsSearchResultsComponent } from './containers';
import { AddJobsUserFilterPopoverConfig } from './data';
import { AddJobsModalEffects, SearchResultsEffects } from './effects';
import { reducers } from './reducers';
import { JobBasedRangePageComponent } from './job-based-range.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('structures_jobBasedRange', reducers),
    EffectsModule.forFeature([
      AddJobsModalEffects,
      SearchResultsEffects
    ]),
    FontAwesomeModule,

    // Payfactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
  ],
  declarations: [
    JobBasedRangePageComponent,
    AddJobsModalComponent,
    AddJobsSearchResultsComponent
  ],
  providers: [
    WindowRef,
    WindowCommunicationService,
    { provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig }
  ],
  exports: [
    JobBasedRangePageComponent
  ]
})
export class JobBasedRangeModule {
  constructor() { }
}
