import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HighchartsChartModule } from 'highcharts-angular';
import 'hammerjs';
import {
  NgbModalModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { HumanizeNumberPipe, PfCommonModule, WindowCommunicationService } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge/guidelines-badge.module';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import { SharedModule } from '../_shared/shared.module';

import {
  JobsCardWrapperComponent,
  JobsCardComponent,
  SummaryCardComponent,
  PeerDataCardComponent,
  ParentDataCardComponent,
  QuickPriceHistoryComponent,
  MarketDataJobResultsComponent,
  PeerJobResultsComponent,
  QuickPriceLandingPageComponent,
  QuickPricePageComponent
} from './containers';
import {
  QuickPriceHistoryEffects
} from './effects';
import { reducers } from './reducers';
import {  TrendingJobGroupComponent, SalaryBarChartComponent,
          SalaryTrendChartComponent, SharePricingSummaryModalComponent, GlossaryOfTermsComponent,
          JobsGridContentComponent
} from './components';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      QuickPriceHistoryEffects
    ]),
    PerfectScrollbarModule,
    PDFExportModule,
    FontAwesomeModule,

    // Routing
    MainRoutingModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    HighchartsChartModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    PfExchangeExplorerModule,
    GuidelinesBadgeModule,
    BasicDataGridModule,
    SharedModule,
    BasicDataGridModule,
    // PfDataGridModule // TODO: [JP] Do we still need this here?
  ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    SalaryBarChartComponent,
    SalaryTrendChartComponent,
    SharePricingSummaryModalComponent,
    GlossaryOfTermsComponent,

    // Pages
    JobsCardComponent,
    SummaryCardComponent,
    PeerDataCardComponent,
    ParentDataCardComponent,
    QuickPriceHistoryComponent,
    MarketDataJobResultsComponent,
    PeerJobResultsComponent,
    JobsCardWrapperComponent,
    QuickPriceLandingPageComponent,
    JobsGridContentComponent,
    QuickPriceLandingPageComponent,
    QuickPricePageComponent
  ],
  providers: [
    WindowRef,
    CurrencyPipe, // TODO: [JP] Do we still need this here?
    DatePipe, // TODO: [JP] Do we still need this here?
    WindowCommunicationService,
    DojGuidelinesService,
    PercentPipe, // TODO: [JP] Do we still need this here?
    HumanizeNumberPipe // TODO: [JP] Do we still need this here?
  ],
  exports: [
    JobsCardWrapperComponent,
    QuickPriceLandingPageComponent,
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
