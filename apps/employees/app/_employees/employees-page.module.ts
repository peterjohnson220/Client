import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { NgbTooltipModule, NgbDropdownModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from '@progress/kendo-angular-dateinputs';
import { HighchartsChartModule } from 'highcharts-angular';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid/pf-data-grid.module';
import { EmployeeManagementModule } from 'libs/features/employees/employee-management';
import { TotalRewardsStatementModule } from 'libs/features/total-rewards/total-rewards-statement';
import { EmployeeSalaryRangeChartModule } from 'libs/features/employees/employee-salary-range-chart';
import { JobPricingGraphModule } from 'libs/features/pricings/job-pricing-graph/job-pricing-graph.module';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { EmployeeInsightsEffects, EmployeesPageEffects } from './effects';
import { EmployeesPageRoutingModule } from './employees-page-routing.module';
import { EmployeesPageComponent } from './employees.page';
import { SharedModule } from '../shared/shared.module';
import { EmployeeDetailsComponent, TotalRewardsTabContentComponent } from './containers';
import { EmployeeInsightsComponent, TotalRewardsStatementLiteComponent } from './components';
import { ContributionCurrencyPipe } from './pipes';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('employees_main', reducers),
    FontAwesomeModule,
    EffectsModule.forFeature([
      EmployeesPageEffects,
      EmployeeInsightsEffects
    ]),
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModule,
    CalendarModule,
    NgbNavModule,
    HighchartsChartModule,

    // Routing
    EmployeesPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    EmployeeManagementModule,
    SharedModule,
    TotalRewardsStatementModule,
    EmployeeSalaryRangeChartModule,
    JobPricingGraphModule
  ],
  declarations: [
    EmployeesPageComponent,
    // Containers
    EmployeeDetailsComponent,

    // Components
    EmployeeInsightsComponent,
    TotalRewardsTabContentComponent,
    TotalRewardsStatementLiteComponent,

    // Pipes
    ContributionCurrencyPipe
  ]
})
export class EmployeesPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








