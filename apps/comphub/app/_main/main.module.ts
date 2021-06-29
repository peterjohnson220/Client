import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { HighchartsChartModule } from 'highcharts-angular';
import 'hammerjs';
import {
  NgbModalModule,
  NgbPaginationModule, NgbPopoverModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
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
import { PfPeerExchangeJobSearchModule } from 'libs/features/peer/exchange-job-search/exchange-job-search.module';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';

import {
  ComphubPageComponent,
  JobsCardComponent,
  MarketsCardComponent,
  CardLayoutComponent,
  SummaryCardComponent,
  PeerDataCardComponent,
  ParentDataCardComponent,
  QuickPriceHistoryComponent,
  ComphubFooterComponent,
  JobGridComponent,
  MarketDataJobGridComponent,
  PeerJobGridComponent,
  TrendsPageComponent,
  TrendsLandingCardComponent,
  TrendsSummaryCardComponent,
  TrendsScopesCardComponent,
  TrendsJobsCardComponent,
  QuickPricePageComponent,
  SavePeerTrendModalComponent,
  PeerTrendGridComponent,
} from './containers';
import {
  JobsCardEffects, MarketsCardEffects, AddPayMarketFormEffects, DataCardEffects, ComphubPageEffects,
  SummaryCardEffects, JobGridEffects, QuickPriceHistoryEffects, TrendsLandingCardEffects, TrendsSummaryCardEffects
} from './effects';
import { reducers } from './reducers';
import { TrendingJobGroupComponent, CardComponent, PaymarketCardsComponent, AddPayMarketFormComponent, SalaryBarChartComponent,
  SalaryTrendChartComponent, SharePricingSummaryModalComponent, GlossaryOfTermsComponent, NewExchangeParticipantsComponent } from './components';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';
import { HistoricalTrendChartComponent } from './components/salary-trend-chart/historical-trend-chart/historical-trend-chart.component';
import { HistoricalOrgIncCountChartComponent } from './components/salary-trend-chart/historical-org-inc-count-chart/historical-org-inc-count-chart.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_main', reducers),
    EffectsModule.forFeature([
      JobsCardEffects,
      DataCardEffects,
      MarketsCardEffects,
      AddPayMarketFormEffects,
      ComphubPageEffects,
      SummaryCardEffects,
      JobGridEffects,
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
        PfSideBarInfoModule,
        PfPeerExchangeJobSearchModule,
        PfDataGridModule
    ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardComponent,
    AddPayMarketFormComponent,
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
    MarketsCardComponent,
    CardLayoutComponent,
    SummaryCardComponent,
    PaymarketCardsComponent,
    PeerDataCardComponent,
    ParentDataCardComponent,
    QuickPriceHistoryComponent,
    ComphubFooterComponent,
    JobGridComponent,
    MarketDataJobGridComponent,
    PeerJobGridComponent,
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
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
