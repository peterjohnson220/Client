import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LayoutModule } from '@progress/kendo-angular-layout';
import {NgbTooltipModule, NgbDropdownModule, NgbTabsetModule,} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';

import {
  JobsDetailsComponent,
  EmployeesGridComponent,
  PricingDetailsGridComponent,
  JobDescriptionComponent,
  StructureGridComponent,
  PricingMatchesGridComponent,
  ProjectDetailsComponent
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
    NgbTooltipModule,
    StoreModule.forFeature('jobsPageMain', reducers),
    EffectsModule.forFeature([
      JobsPageEffects,
      JobDescriptionEffects,
    ]),
    FontAwesomeModule,
    NgbTabsetModule,

    // Routing
    JobsPageRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfDataGridModule
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

    // Column Templates
    PricingMatchesJobTitleComponent
  ]
})
export class JobsPageModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
