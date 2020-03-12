import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';
import { EmployeeManagementModule } from 'libs/features/employee-management';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import { EmployeesPageEffects } from './effects';
import { EmployeesPageRoutingModule } from './employees-page-routing.module';
import { EmployeesPageComponent } from './employees.page';

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

    // Routing
    EmployeesPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    EmployeeManagementModule,
  ],
  declarations: [
    EmployeesPageComponent,
    // Containers

    // Components
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService }
  ]
})
export class EmployeesPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}








