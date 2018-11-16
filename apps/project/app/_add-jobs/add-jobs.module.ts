import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { AddJobsRoutingModule } from './add-jobs-routing.module';
import { reducers } from './reducers';
import { AddJobsPageEffects, SearchResultsEffects } from './effects';
import { AddJobsPageComponent, SearchResultsComponent } from './containers';
import { JobResultComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule, FormsModule,

    // 3rd Party
    StoreModule.forFeature('project_addJobs', reducers),
    EffectsModule.forFeature([
      AddJobsPageEffects,
      SearchResultsEffects
    ]),
    InfiniteScrollModule,
    // Routing
    AddJobsRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule
  ],
  declarations: [
    // Components
    SearchResultsComponent,
    JobResultComponent,

    // Pages
    AddJobsPageComponent
  ],
  providers: []
})
export class AddJobsModule { }
