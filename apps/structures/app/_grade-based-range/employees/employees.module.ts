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
import { SharedModule } from '../../shared/shared.module';
import { GradeBasedSharedModule } from '../shared/shared.module';
import { GradeBasedEmployeeSalaryRangeChartComponent } from './containers';


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
    SharedModule,
    GradeBasedSharedModule
  ],
  declarations: [
    EmployeesPageComponent,
    GradeBasedEmployeeSalaryRangeChartComponent
  ]
})
export class EmployeesModule {
  constructor() { }
}
