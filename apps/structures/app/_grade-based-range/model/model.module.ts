import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PfFormsModule } from 'libs/forms';
import { PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfAddJobsModule } from 'libs/features/jobs/add-jobs';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSearchModule } from 'libs/features/search/search';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';

import { ModelRoutingModule } from './model-routing.module';
import { ModelPageComponent } from './model.page/model.page';
import { SharedModule } from './../../shared/shared.module';
import { GradeBasedSummaryChartComponent } from './containers/grade-based-summary-chart';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    NgbCollapseModule,

    // PayFactors
    PfFormsModule,
    PfDataGridModule,
    PfCommonModule,
    PfAddJobsModule,
    PfCommonUIModule,
    PfSearchModule,

    // Routing
    ModelRoutingModule,

    SharedModule,

    // 3rd party
    HighchartsChartModule
  ],
  declarations: [ModelPageComponent, GradeBasedSummaryChartComponent],
  providers: [
    WindowRef,
    WindowCommunicationService
  ]
})
export class ModelModule {
  constructor() {}
}
