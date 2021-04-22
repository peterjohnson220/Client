import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { JobsRoutingModule } from './jobs-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { GradeBasedSharedModule } from '../shared/shared.module';
import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobViewRangeChartComponent } from './containers/job-view-range-chart/job-view-range-chart.component';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    HighchartsChartModule,

    // Payfactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfCommonUIModule,

    // Routing
    JobsRoutingModule,

    // Shared
    SharedModule,
    GradeBasedSharedModule
  ],
  declarations: [
    JobsPageComponent,
    JobViewRangeChartComponent
  ]
})
export class JobsModule {
  constructor() { }
}
