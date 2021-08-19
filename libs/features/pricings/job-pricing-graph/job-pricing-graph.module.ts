import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PfCommonUIModule } from 'libs/ui/common';

import { JobPricingGraphComponent } from './job-pricing-graph/job-pricing-graph.component';
import { JobPricingGraphEffects } from './effects/job-pricing-graph.effects';
import { reducers } from './reducers';
import { HighchartsChartModule } from 'highcharts-angular';
import { CsdPricingGraphComponent } from './csd-pricing-graph/csd-pricing-graph.component';

@NgModule({
  declarations: [
    JobPricingGraphComponent,
    CsdPricingGraphComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('feature_base_pay_graph', reducers),
    EffectsModule.forFeature([
      JobPricingGraphEffects,
    ]),
    PfCommonUIModule,
    HighchartsChartModule
  ],
  exports: [
    JobPricingGraphComponent,
    CsdPricingGraphComponent
  ]
})
export class JobPricingGraphModule {}
