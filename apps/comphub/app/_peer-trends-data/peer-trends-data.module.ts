import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HighchartsChartModule } from 'highcharts-angular';

import { HumanizeNumberPipe, PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';
import { PfPeerRelationalExchangeJobSearchModule } from 'libs/features/peer/relational-exchange-job-search/relational-exchange-job-search.module';
import { PfSideBarInfoModule } from 'libs/features/side-bar-info/side-bar-info.module';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { PfExchangeExplorerModule } from 'libs/features/peer';

import { SharedModule } from '../_shared/shared.module';

import { PeerTrendsDataRoutingModule } from './peer-trends-data-routing.module';
import {
  TrendsPageComponent,
  TrendsJobsCardComponent,
  TrendsLandingCardComponent,
  TrendsScopesCardComponent,
  TrendsSummaryCardComponent,
  PeerTrendGridComponent,
  SavePeerTrendModalComponent,
  HistoricalTrendChartComponent,
  HistoricalOrgIncCountChartComponent
} from './containers';
import { NewExchangeParticipantsComponent } from './components';
import { TrendsLandingCardEffects, TrendsSummaryCardEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('comphub_peerTrendsData', reducers),
    EffectsModule.forFeature([
      TrendsLandingCardEffects,
      TrendsSummaryCardEffects
    ]),
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    HighchartsChartModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    BasicDataGridModule, // TODO: [JP] Do we still need this here?
    PfDataGridModule,
    PfSideBarInfoModule,

    // Payfactors PEER
    PfExchangeExplorerModule,
    GuidelinesBadgeModule,
    PfPeerRelationalExchangeJobSearchModule,

    // Local
    SharedModule,
    PeerTrendsDataRoutingModule

  ],
  declarations: [
    TrendsPageComponent,
    TrendsJobsCardComponent,
    TrendsLandingCardComponent,
    TrendsScopesCardComponent,
    TrendsSummaryCardComponent,
    NewExchangeParticipantsComponent,
    HistoricalTrendChartComponent,
    HistoricalOrgIncCountChartComponent,
    SavePeerTrendModalComponent,
    PeerTrendGridComponent,
    HistoricalTrendChartComponent,
    HistoricalOrgIncCountChartComponent
  ],
  providers: [  // TODO: [JP] Do we need all of these for trends?
    WindowRef,
    CurrencyPipe,
    DatePipe,
    WindowCommunicationService,
    DojGuidelinesService,
    PercentPipe,
    HumanizeNumberPipe
  ],
})
export class PeerTrendsDataModule {
  constructor() { }
}
