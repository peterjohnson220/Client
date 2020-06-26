import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from '@progress/kendo-angular-dateinputs';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';
import { EmployeeManagementModule } from 'libs/features/employee-management';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { EmployeesPageEffects } from './effects';
import { EmployeesPageRoutingModule } from './employees-page-routing.module';
import { EmployeesPageComponent } from './employees.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('employees_main', reducers),
    FontAwesomeModule,
    EffectsModule.forFeature([
      EmployeesPageEffects
    ]),
    NgbTooltipModule,
    CalendarModule,

    // Routing
    EmployeesPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    EmployeeManagementModule,
    SharedModule
  ],
  declarations: [
    EmployeesPageComponent,
    // Containers
  ]
})
export class EmployeesPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








