import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SwitchModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { NgbTooltipModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from './fa-icons';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import {EmployeeDetailsModule} from 'libs/ui/employee-details';
import { StructureDetailsModule } from 'libs/ui/structure-details';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';
import { MultiMatchModule } from 'libs/features/pricings/multi-match';
import { UpsertPeerDataCutModule } from 'libs/features/pricings/upsert-peer-data-cut';
import { ReScopeSurveyDataModule } from 'libs/features/surveys/re-scope-survey-data';
import { DataCutSummaryModule } from 'libs/features/pricings/data-cut-summary';
import { NotesManagerModule } from 'libs/features/notes/notes-manager';
import { RangeEditorModule } from 'libs/features/structures/range-editor';
import { PricingDetailsModule } from 'libs/features/pricings/pricing-details';
import { JobManagementModule } from 'libs/features/jobs/job-management';
import { PricingsHistoryChartModule } from 'libs/features/pricings/pricings-history-chart';
import { PfJobDescriptionManagementModule } from 'libs/features/jobs/job-description-management';

import { JobsPageComponent } from './jobs.page/jobs.page';
import { JobsPageRoutingModule } from './jobs-page-routing.module';
import { MatchesModalModule } from '../_matches-modal/matches-modal.module';

import {
  JobsDetailsComponent,
  PaymarketsGridComponent,
  EmployeesGridComponent,
  JobDescriptionComponent,
  StructureGridComponent,
  PricingMatchesGridComponent,
  ProjectDetailsGridComponent,
  PricingHistoryGridComponent,
  ExportListPopoverComponent,
  PricingDetailsMrpColumnComponent,
  PeerExchangeMatchesComponent,
  PricingMatchesJobTitleComponent,
  PricingDetailsAdjPctColumnComponent,
  JobInsightsComponent
} from './components';
import {
  MarketDataComponent,
  DeleteMatchModalComponent
} from './containers';
import { reducers } from './reducers';
import {
  JobsPageEffects,
  JobDescriptionEffects,
  JobPeerMatchesEffects,
  ModifyPricingsEffects,
  JobInsightsEffects
} from './effects';
import {
  ShowingActiveJobs,
  PricingMatchTypePipe,
  JobTitleCodePipe,
  ModifyPricingMatchError,
  ModifyPricingError,
  CanModifyMatch,
  GetMatchScope
} from './pipes';

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
        StoreModule.forFeature('jobsPageMain', reducers),
        EffectsModule.forFeature([
            JobsPageEffects,
            ModifyPricingsEffects,
            JobDescriptionEffects,
            JobPeerMatchesEffects,
            JobInsightsEffects
        ]),
        FontAwesomeModule,
        TooltipModule,
        NumericTextBoxModule,
        DropDownListModule,
        GridModule,

        // Routing
        JobsPageRoutingModule,

        // Payfactors
        PfCommonModule,
        PfCommonUIModule,
        PfFormsModule,
        PfDataGridModule,
        BasicDataGridModule,
        JobManagementModule,
        MatchesModalModule,
        PricingDetailsModule,
        PricingsHistoryChartModule,
        RangeEditorModule,
        NotesManagerModule,
        MultiMatchModule,
        DataCutSummaryModule,
        ReScopeSurveyDataModule,
        UpsertPeerDataCutModule,
        EmployeeDetailsModule,
        StructureDetailsModule,
        PfJobDescriptionManagementModule
    ],
  declarations: [
    // Pages
    JobsPageComponent,

    // Job Details Components
    JobsDetailsComponent,
    PaymarketsGridComponent,
    EmployeesGridComponent,
    PricingMatchesGridComponent,
    JobDescriptionComponent,
    StructureGridComponent,
    ProjectDetailsGridComponent,
    PricingHistoryGridComponent,
    JobInsightsComponent,
    MarketDataComponent,
    DeleteMatchModalComponent,

    // Column Templates
    PricingMatchesJobTitleComponent,
    PricingDetailsMrpColumnComponent,

    // Jobs Grid Components
    PeerExchangeMatchesComponent,
    ExportListPopoverComponent,

    // Pipes
    ShowingActiveJobs,
    PricingMatchTypePipe,
    JobTitleCodePipe,
    ModifyPricingError,
    ModifyPricingMatchError,
    PricingDetailsAdjPctColumnComponent,
    CanModifyMatch,
    GetMatchScope
  ]
})
export class JobsPageModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
