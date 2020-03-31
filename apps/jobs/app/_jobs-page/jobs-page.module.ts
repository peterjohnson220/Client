import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { NgbTooltipModule, NgbTabsetModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TooltipModule } from '@progress/kendo-angular-tooltip'

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule } from 'libs/features/pf-data-grid/pf-data-grid.module';
import { JobManagementModule } from 'libs/features/job-management/job-management.module';

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
  PricingHistoryComponent,
  NotPricedPaymarketsComponent,
  ExportListPopoverComponent
} from './components';
import { reducers } from './reducers';
import { JobsPageEffects, JobDescriptionEffects } from './effects';
import { PricingMatchesJobTitleComponent } from './grid-column-templates';
import { PeerExchangeMatchesComponent } from './components/peer-exchange-matches/peer-exchange-matches.component';
import {JobPeerMatchesEffects} from './effects/job-peer-matches.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd Party
    LayoutModule,
    SwitchModule,
    NgbModule,
    NgbTooltipModule,
    NgbTabsetModule,
    StoreModule.forFeature('jobsPageMain', reducers),
    EffectsModule.forFeature([
      JobsPageEffects,
      JobDescriptionEffects,
      JobPeerMatchesEffects,
    ]),
    FontAwesomeModule,
    TooltipModule,
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
    NotPricedPaymarketsComponent,
    ExportListPopoverComponent,

    // Column Templates
    PricingMatchesJobTitleComponent,

    PeerExchangeMatchesComponent
  ]
})
export class JobsPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
