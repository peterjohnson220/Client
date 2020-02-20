import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { JobBasedRangeModule } from './';
import { RangeGroupExistsGuard } from './job-based-range';
import { NewRoutingModule } from './new-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party

    // Routing
    NewRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule,

    // Features
    JobBasedRangeModule
  ],
  providers: [
    RangeGroupExistsGuard
  ]
})
export class NewModule {
  constructor() { }
}
