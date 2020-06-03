import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { NgbTooltipModule, NgbTabsetModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfDataGridModule, JobManagementModule, PricingDetailsModule, RangeEditorModule, NotesManagerModule, MultiMatchModule } from 'libs/features';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';
import { MatchesModalModule } from '../_matches-modal/matches-modal.module';

import {
  JobsDetailsComponent,
  EmployeesGridComponent,
  PricingDetailsGridComponent,
  JobDescriptionComponent,
  StructureGridComponent,
  PricingMatchesGridComponent,
  ProjectDetailsGridComponent,
  PricingHistoryGridComponent,
  NotPricedPaymarketsGridComponent,
  ExportListPopoverComponent,
  PricingDetailsMrpColumnComponent,
  PeerExchangeMatchesComponent,
  PricingMatchesJobTitleComponent
} from './components';
import { reducers } from './reducers';
import { JobsPageEffects, JobDescriptionEffects, JobPeerMatchesEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,


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
      JobPeerMatchesEffects
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
    JobManagementModule,
    MatchesModalModule,
    PricingDetailsModule,
    RangeEditorModule,
    NotesManagerModule,
    MultiMatchModule
  ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Job Details Components
    JobsDetailsComponent,
    EmployeesGridComponent,
    PricingDetailsGridComponent,
    PricingMatchesGridComponent,
    JobDescriptionComponent,
    StructureGridComponent,
    ProjectDetailsGridComponent,
    PricingHistoryGridComponent,
    NotPricedPaymarketsGridComponent,

    // Column Templates
    PricingMatchesJobTitleComponent,
    PricingDetailsMrpColumnComponent,

    // Jobs Grid Components
    PeerExchangeMatchesComponent,
    ExportListPopoverComponent
  ]
})
export class JobsPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
