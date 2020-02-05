import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { NgbTooltipModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';
import { JobManagementModule } from 'libs/features/job-management/job-management.module';
import { DataViewApiService } from 'libs/data/payfactors-api/reports';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';

import {
  JobsDetailsComponent,
  EmployeesGridComponent,
  PricingDetailsGridComponent,
  JobDescriptionComponent,
  StructureGridComponent,
  PricingMatchesGridComponent,
  ProjectDetailsComponent,
  PricingHistoryComponent
} from './components';
import { reducers } from './reducers';
import { JobsPageEffects, JobDescriptionEffects } from './effects';
import { PricingMatchesJobTitleComponent } from './grid-column-templates';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    LayoutModule,
    SwitchModule,
    NgbTooltipModule,
    StoreModule.forFeature('jobsPageMain', reducers),
    EffectsModule.forFeature([
      JobsPageEffects,
      JobDescriptionEffects,
    ]),
    FontAwesomeModule,
    NgbTabsetModule,
    DropDownListModule,

    // Routing
    JobsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule,
    JobManagementModule
  ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Components
    JobsDetailsComponent,
    EmployeesGridComponent,
    PricingDetailsGridComponent,
    PricingMatchesGridComponent,
    JobDescriptionComponent,
    StructureGridComponent,
    ProjectDetailsComponent,
    PricingHistoryComponent,

    // Column Templates
    PricingMatchesJobTitleComponent
  ],
  providers: [
    { provide: 'DataViewService', useClass: DataViewApiService }
  ]
})
export class JobsPageModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
