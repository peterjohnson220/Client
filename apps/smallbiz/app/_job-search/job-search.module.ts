import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { JobSearchRoutingModule } from './job-search-routing.module';
import { JobDetailPageComponent, JobSearchPageComponent, PriceJobComponent } from './containers';
import { JobDetailEffects, JobSearchEffects, PriceJobEffects } from './effects';
import { JobService, LocationService } from './services';

@NgModule({
  declarations: [
    JobDetailPageComponent,
    JobSearchPageComponent,
    PriceJobComponent
  ],
  imports: [
    // Angular
    FormsModule,
    CommonModule,

    // Third Party
    StoreModule.forFeature('jobSearchArea', reducers),
    EffectsModule.forFeature([JobDetailEffects, JobSearchEffects, PriceJobEffects]),
    DropDownsModule,

    // Routing
    JobSearchRoutingModule
  ],
  providers: [
    JobService,
    LocationService
  ]
})
export class JobSearchModule { }
