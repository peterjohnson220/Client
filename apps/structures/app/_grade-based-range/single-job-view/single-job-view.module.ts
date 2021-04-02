import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import { PfFormsModule } from 'libs/forms';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { SharedModule } from '../../shared/shared.module';
import { GradeBasedSharedModule } from '../shared/shared.module';
import { SingleJobViewPageComponent } from './single-job-view.page';
import { SingleJobViewRoutingModule } from './single-job-view-routing.module';

@NgModule({
  imports: [
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
    SingleJobViewRoutingModule,

    // Shared
    SharedModule,
    GradeBasedSharedModule
  ],
  declarations: [
    SingleJobViewPageComponent
  ],
})
export class SingleJobViewModule {
  constructor() {}
}
