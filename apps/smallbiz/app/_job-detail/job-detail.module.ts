import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { JobDetailEffects } from './effects';

import { JobDetailRoutingModule } from './job-detail-routing.module';
import { JobDetailPageComponent } from './containers/pages/job-detail/job-detail.page';
import { JobService } from '../shared/services/job.service';

@NgModule({
  declarations: [
    JobDetailPageComponent
  ],
  imports: [
    // Angular
    FormsModule,
    CommonModule,

    // Third Party
    StoreModule.forFeature('jobDetailArea', reducers),
    EffectsModule.forFeature([JobDetailEffects]),

    // Routing
    JobDetailRoutingModule
  ],
  providers: [
    JobService
  ]
})
export class JobDetailModule { }
