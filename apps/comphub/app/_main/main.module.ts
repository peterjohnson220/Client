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
import { PfSideBarInfoModule } from 'libs/features/side-bar-info/side-bar-info.module';
import { PfPeerRelationalExchangeJobSearchModule } from 'libs/features/peer/relational-exchange-job-search/relational-exchange-job-search.module';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';

import {
  JobsCardWrapperComponent,
  ComphubPageComponent,
  JobsCardComponent,
  SummaryCardComponent,
  PeerDataCardComponent,
  ParentDataCardComponent,
  QuickPriceHistoryComponent,
  ComphubFooterComponent,
  MarketDataJobResultsComponent,
  PeerJobResultsComponent,
  QuickPriceLandingPageComponent,
  TrendsPageComponent,
  TrendsLandingCardComponent,
  TrendsSummaryCardComponent,
  TrendsScopesCardComponent,
  TrendsJobsCardComponent,
  QuickPricePageComponent,
  SavePeerTrendModalComponent,
  PeerTrendGridComponent
} from './containers';
import {
  QuickPriceHistoryEffects, TrendsLandingCardEffects, TrendsSummaryCardEffects
} from './effects';
import { reducers } from './reducers';
import {  TrendingJobGroupComponent, CardComponent, SalaryBarChartComponent,
          SalaryTrendChartComponent, SharePricingSummaryModalComponent, GlossaryOfTermsComponent,
          NewExchangeParticipantsComponent, JobsGridContentComponent, HistoricalTrendChartComponent,
          HistoricalOrgIncCountChartComponent
} from './components';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      QuickPriceHistoryEffects,
      TrendsLandingCardEffects,
      TrendsSummaryCardEffects
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
    PfSideBarInfoModule,
    PfPeerRelationalExchangeJobSearchModule,
    PfDataGridModule
  ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardComponent,
    SalaryBarChartComponent,
    SalaryTrendChartComponent,
    HistoricalTrendChartComponent,
    HistoricalOrgIncCountChartComponent,
    SharePricingSummaryModalComponent,
    GlossaryOfTermsComponent,
    SavePeerTrendModalComponent,

    // Pages
    ComphubPageComponent,
    TrendsPageComponent,
    JobsCardComponent,
    SummaryCardComponent,
    PeerDataCardComponent,
    ParentDataCardComponent,
    QuickPriceHistoryComponent,
    ComphubFooterComponent,
    MarketDataJobResultsComponent,
    PeerJobResultsComponent,
    JobsCardWrapperComponent,
    QuickPriceLandingPageComponent,
    JobsGridContentComponent,
    QuickPriceLandingPageComponent,
    TrendsLandingCardComponent,
    TrendsJobsCardComponent,
    TrendsScopesCardComponent,
    TrendsSummaryCardComponent,
    QuickPricePageComponent,
    NewExchangeParticipantsComponent,
    PeerTrendGridComponent
  ],
  providers: [
    WindowRef,
    CurrencyPipe,
    DatePipe,
    WindowCommunicationService,
    DojGuidelinesService,
    PercentPipe,
    HumanizeNumberPipe
  ],
  exports: [
    JobsCardWrapperComponent,
    ComphubFooterComponent,
    QuickPriceLandingPageComponent,
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
