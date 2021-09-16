import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HighchartsChartModule } from 'highcharts-angular';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { reducers } from './reducers';
import { EmployeeSalaryRangeChartComponent } from './containers';
import { EmployeeSalaryRangeChartEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('employeeSalaryRangeChart_main', reducers),
    EffectsModule.forFeature([
      EmployeeSalaryRangeChartEffects
    ]),
    HighchartsChartModule,
    DropDownsModule,

    // Payfactors
    PfCommonUIModule,
    BasicDataGridModule
  ],
  declarations: [
    EmployeeSalaryRangeChartComponent
  ],
  exports: [
    EmployeeSalaryRangeChartComponent
  ]
})
export class EmployeeSalaryRangeChartModule {}
