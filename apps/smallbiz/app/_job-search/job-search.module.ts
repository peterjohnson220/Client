import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { JobSearchEffects } from './effects';

import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobSearchPageComponent } from './containers/pages/job-search';
import { JobService } from '../shared/services/job.service';

@NgModule({
  declarations: [
    JobSearchPageComponent,
  ],
  imports: [
    // Angular
    FormsModule,
    CommonModule,

    // Third Party
    StoreModule.forFeature('jobSearchArea', reducers),
    EffectsModule.forFeature([JobSearchEffects]),

    // Routing
    JobSearchRoutingModule
  ],
  providers: [
    JobService
  ]
})
export class JobSearchModule { }
