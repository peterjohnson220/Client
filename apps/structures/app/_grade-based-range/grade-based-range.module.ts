import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { GradeBasedRangeRoutingModule } from './grade-based-range-routing.module';
import { GradeBasedRangeGroupGuard, RangeGroupExistsGuard } from '../shared/guards';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    GradeBasedRangeRoutingModule,

    // PF
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    FontAwesomeModule
  ],
  providers: [
    RangeGroupExistsGuard,
    GradeBasedRangeGroupGuard
  ]
})
export class GradeBasedRangeModule { }
