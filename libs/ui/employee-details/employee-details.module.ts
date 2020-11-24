import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from '@progress/kendo-angular-charts';
import 'hammerjs';

import { PfCommonModule } from '../../core';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmplyeeInfoComponent } from './components/emplyee-info/emplyee-info.component';
import { CompensationChartsComponent } from './components/compensation-charts/compensation-charts.component';
import { EmployeeInfoChartDisplayComponent } from './components/employee-info-chart-display/employee-info-chart-display.component';

@NgModule({
  declarations: [
    // Feature
    EmployeeDetailsComponent,

    // Components
    EmplyeeInfoComponent,
    CompensationChartsComponent,
    EmployeeInfoChartDisplayComponent
  ],
  exports: [
    EmployeeDetailsComponent,
  ],
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    ChartsModule,

    // Payfactors
    PfCommonModule,
    PerfectScrollbarModule
  ]
})
export class EmployeeDetailsModule {
  constructor() {}
}
