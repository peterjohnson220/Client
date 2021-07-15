import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import 'hammerjs';
import {
  NgbModalModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge/guidelines-badge.module';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import {
  ComphubPageComponent, JobsCardComponent,
  SummaryCardComponent, PeerDataCardComponent, ParentDataCardComponent, QuickPriceHistoryComponent,
  ComphubFooterComponent, MarketDataJobResultsComponent, PeerJobResultsComponent, QuickPriceLandingPageComponent,
  JobsCardWrapperComponent
} from './containers';
import { QuickPriceHistoryEffects } from './effects';
import { reducers } from './reducers';
import { TrendingJobGroupComponent, CardComponent, SalaryBarChartComponent,
  SalaryTrendChartComponent, SharePricingSummaryModalComponent, GlossaryOfTermsComponent, JobsGridContentComponent } from './components';
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
            QuickPriceHistoryEffects
        ]),
        PDFExportModule,
        FontAwesomeModule,

        // Routing
        MainRoutingModule,

        // 3rd Party
        DropDownsModule,
        GridModule,
        ChartModule,
        NgbPaginationModule,
        NgbModalModule,
        NgbProgressbarModule,
        NgbTooltipModule,

        // Payfactors
        PfCommonModule,
        PfCommonUIModule,
        PfFormsModule,
        PfExchangeExplorerModule,
        GuidelinesBadgeModule,
        BasicDataGridModule,
        SharedModule
    ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardComponent,
    SalaryBarChartComponent,
    SalaryTrendChartComponent,
    SharePricingSummaryModalComponent,
    GlossaryOfTermsComponent,

    // Pages
    ComphubPageComponent,
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
    JobsGridContentComponent
  ],
  providers: [
    WindowRef,
    CurrencyPipe,
    WindowCommunicationService,
    DojGuidelinesService
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
