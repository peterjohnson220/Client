import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HighchartsChartModule } from 'highcharts-angular';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';
import { JobPricingGraphModule } from 'libs/features/pricings/job-pricing-graph';

import { CrowdSourcedDataRoutingModule } from './crowd-sourced-data-routing.module';
import * as fromFaIcons from './fa-icons';
import {
  CrowdSourcedJobsCardComponent,
  CrowdSourcedJobResultsComponent,
  CrowdSourcedDataPageComponent,
  CrowdSourcedSummaryCardComponent,
  CompensableFactorsComponent} from './containers';
import { MainModule } from '../_main/main.module';
import { CrowdSourcedDataPageGuard } from './guards';
import { SharedModule } from '../_shared/shared.module';
import { CrowdSourcedJobGridContentComponent, CompensableFactorTypeComponent} from './components';
import { reducers } from './reducers';
import { CompensableFactorsEffect } from './effects';
import { ExportDataEffect } from './effects/export-data.effect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CrowdSourcedDataRoutingModule,
    MainModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,
    HighchartsChartModule,

    StoreModule.forFeature('comphub_crowd_sourced', reducers),
    EffectsModule.forFeature([
      CompensableFactorsEffect,
      ExportDataEffect
    ]),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    GuidelinesBadgeModule,
    BasicDataGridModule,
    SharedModule,
    JobPricingGraphModule

  ],
  declarations: [
    CrowdSourcedDataPageComponent,
    CrowdSourcedJobsCardComponent,
    CrowdSourcedJobResultsComponent,
    CrowdSourcedJobGridContentComponent,
    CrowdSourcedSummaryCardComponent,
    CompensableFactorTypeComponent,
    CompensableFactorsComponent,
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
