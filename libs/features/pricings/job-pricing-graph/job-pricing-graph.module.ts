import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HighchartsChartModule } from 'highcharts-angular';

import { PfCommonUIModule } from 'libs/ui/common';

import { JobPricingBaseGraphComponent } from './containers/job-pricing-base-graph/job-pricing-base-graph.component';
import { JobPricingTccGraphComponent } from './containers/job-pricing-tcc-graph/job-pricing-tcc-graph.component';
import { CsdPricingGraphComponent } from './containers/csd-pricing-graph/csd-pricing-graph.component';
import { JobPricingGraphEffects } from './effects/job-pricing-graph.effects';
import { reducers } from './reducers';

@NgModule({
  declarations: [
    JobPricingBaseGraphComponent,
    JobPricingTccGraphComponent,
    CsdPricingGraphComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('feature_job_pricing_graph', reducers),
    EffectsModule.forFeature([
      JobPricingGraphEffects,
    ]),
    PfCommonUIModule,
    HighchartsChartModule
  ],
  exports: [
    JobPricingBaseGraphComponent,
    JobPricingTccGraphComponent,
    CsdPricingGraphComponent
  ]
})
export class JobPricingGraphModule {}
