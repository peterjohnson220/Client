import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';

import { HighchartsChartModule } from 'highcharts-angular';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesPageComponent } from './employees.page/employees.page';
import { JobBasedSharedModule } from '../shared/shared.module';
import { EmployeeSalaryRangeChartComponent } from './containers';

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
    EmployeesRoutingModule,

    // Shared
    JobBasedSharedModule
  ],
  declarations: [
    EmployeesPageComponent,
    EmployeeSalaryRangeChartComponent
  ]
})
export class EmployeesModule {
  constructor() { }
}
