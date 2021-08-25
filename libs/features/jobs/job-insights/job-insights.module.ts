import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HighchartsChartModule } from 'highcharts-angular';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { reducers } from './reducers';
import { JobInsightsEffects } from './effects';
import {
  JobInsightsJobDetailsComponent,
  DataMatchesComponent,
  JobInsightsJobSummaryComponent
} from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('jobInsights_main', reducers),
    EffectsModule.forFeature([
      JobInsightsEffects
    ]),
    HighchartsChartModule,
    GridModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    BasicDataGridModule
  ],
  declarations: [
    JobInsightsJobDetailsComponent,
    JobInsightsJobSummaryComponent,
    DataMatchesComponent
  ],
  exports: [
    JobInsightsJobDetailsComponent,
    JobInsightsJobSummaryComponent,
    DataMatchesComponent
  ],
})
export class JobInsightsModule {
  constructor() {  }
}
