import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule , FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';

import * as fromFaIcons from './fa-icons';
import { EmployeeHistoryPageRoutingModule } from './employee-history-page-routing.module';
import { EmployeeHistoryPageComponent } from './employee-history.page';
import { SharedModule } from '../shared/shared.module';
import { ValidDateGuard } from './guards/valid-date.guard';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    FontAwesomeModule,
    NgbTooltipModule,

    // Routing
    EmployeeHistoryPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    SharedModule
  ],
  declarations: [
    EmployeeHistoryPageComponent,
    // Containers
  ],
  providers: [
    ValidDateGuard
  ]
})
export class EmployeeHistoryPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
