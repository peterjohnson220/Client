import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { RangeGroupExistsGuard } from './model';
import { JobBasedRangeRoutingModule } from './job-based-range-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party

    // Routing
    JobBasedRangeRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule
  ],
  providers: [
    RangeGroupExistsGuard
  ]
})
export class JobBasedRangeModule {
  constructor() { }
}
