import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PfDataGridModule } from 'libs/features/pf-data-grid';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { PricingsPageComponent } from './pricings.page/pricings.page';
import { PricingsRoutingModule } from './pricings-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PricingsSalaryRangeChartComponent } from './containers';

import { MultiMatchModule } from 'libs/features/multi-match';


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
        PricingsRoutingModule,

        // Shared
        SharedModule,
        MultiMatchModule
    ],
  declarations: [
    PricingsSalaryRangeChartComponent,
    PricingsPageComponent
  ]
})
export class PricingsModule {
  constructor() { }
}
