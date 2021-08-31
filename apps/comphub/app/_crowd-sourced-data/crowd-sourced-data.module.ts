import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { CrowdSourcedDataRoutingModule } from './crowd-sourced-data-routing.module';
import * as fromFaIcons from './fa-icons';
import {
  CrowdSourcedJobsCardComponent,
  CrowdSourcedJobResultsComponent,
  CrowdSourcedDataPageComponent,
  CrowdSourcedSummaryCardComponent } from './containers';
import { CrowdSourcedDataPageGuard } from './guards';
import { SharedModule } from '../_shared/shared.module';
import { CrowdSourcedJobGridContentComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CrowdSourcedDataRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    GuidelinesBadgeModule,
    BasicDataGridModule,
    SharedModule

  ],
  declarations: [
    CrowdSourcedDataPageComponent,
    CrowdSourcedJobsCardComponent,
    CrowdSourcedJobResultsComponent,
    CrowdSourcedJobGridContentComponent,
    CrowdSourcedSummaryCardComponent
  ],
  providers: [
    CrowdSourcedDataPageGuard
  ]
})
export class CrowdSourcedDataModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
