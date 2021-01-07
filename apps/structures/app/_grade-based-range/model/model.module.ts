import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';

import { ModelRoutingModule } from './model-routing.module';
import { ModelPageComponent } from './model.page/model.page';
import { HighchartsChartModule } from 'highcharts-angular';
import { GradeBasedSharedModule } from '../shared/shared.module';
import { JobBasedSharedModule } from '../../_job-based-range/shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // PayFactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,

    // Routing
    ModelRoutingModule,

    GradeBasedSharedModule,
    JobBasedSharedModule,

    // 3rd party
    HighchartsChartModule
  ],
  declarations: [ModelPageComponent],
  providers: [
    WindowRef,
    WindowCommunicationService
  ]
})
export class ModelModule {
  constructor() {}
}
