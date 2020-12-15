import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { MomentModule } from 'ngx-moment';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';

import { reducers } from './reducers';
import { PricingHistoryChartEffects } from './effects';

import { PricingsHistoryChartComponent } from './pricings-history-chart/pricings-history-chart.component';
import { PricingHistoryChartFiltersComponent } from './containers/pricing-history-chart-filters';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('feature_pricing_history_chart', reducers),
    EffectsModule.forFeature([
      PricingHistoryChartEffects,
    ]),
    LayoutModule,
    DropDownsModule,
    IntlModule,
    DateInputsModule,
    MomentModule,

    // Payfactors
    PfCommonUIModule,
    PfCommonModule,
    PfFormsModule,
  ],
  declarations: [
    // Feature
    PricingsHistoryChartComponent,
    PricingHistoryChartFiltersComponent,
  ],
  exports: [
    PricingsHistoryChartComponent,
  ]
})

export class PricingsHistoryChartModule { }
