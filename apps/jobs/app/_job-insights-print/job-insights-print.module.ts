import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { JobInsightsModule } from 'libs/features/jobs/job-insights';
import { JobPricingGraphModule } from 'libs/features/pricings/job-pricing-graph';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { JobInsightsPrintRoutingModule } from './job-insights-print-routing.module';
import { JobInsightsPrintPageComponent } from './job-insights-print.page';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    JobInsightsPrintRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    JobInsightsModule,
    JobPricingGraphModule,
    BasicDataGridModule
  ],
  declarations: [
    JobInsightsPrintPageComponent
  ]
})
export class JobInsightsPrintModule {}
