import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { UserFilterPopoverConfig } from 'libs/features/users/user-filter/models';
import { AddJobsConfig } from 'libs/features/jobs/add-jobs/data';
import { PfAddJobsToRangeModule } from 'libs/features/structures/add-jobs-to-range';

import { ModelRoutingModule } from './model-routing.module';
import { ModelPageComponent } from './model.page';
import { GradeBasedSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../shared/shared.module';
import { GradeBasedRangeAddJobsConfig } from './data/grade-based-range-add-jobs.config';
import { AddJobsUserFilterPopoverConfig } from '../../shared/data';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // PayFactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,
    PfAddJobsToRangeModule,

    // Routing
    ModelRoutingModule,

    GradeBasedSharedModule,
    SharedModule,

    // 3rd party
    HighchartsChartModule
  ],
  declarations: [ModelPageComponent],
  providers: [
    WindowRef,
    WindowCommunicationService,
    { provide: UserFilterPopoverConfig, useValue: AddJobsUserFilterPopoverConfig },
    { provide: AddJobsConfig, useValue: GradeBasedRangeAddJobsConfig }
  ]
})
export class ModelModule {
  constructor() {}
}
