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
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { PfCommonModule, WindowCommunicationService } from 'libs/core';
import { WindowRef } from 'libs/core/services';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { JobLimitCounterComponent } from 'libs/features/smallbiz';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge/guidelines-badge.module';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';


import {
  ComphubPageComponent, JobsCardComponent, MarketsCardComponent, CardLayoutComponent,
  SummaryCardComponent, PeerDataCardComponent, ParentDataCardComponent, QuickPriceHistoryComponent,
  ComphubFooterComponent, JobGridComponent
} from './containers';
import { JobsCardEffects, MarketsCardEffects, AddPayMarketFormEffects, DataCardEffects, ComphubPageEffects,
  SummaryCardEffects } from './effects';
import { reducers } from './reducers';
import { TrendingJobGroupComponent, CardComponent, PaymarketCardsComponent, AddPayMarketFormComponent, SalaryBarChartComponent,
  SalaryTrendChartComponent, SharePricingSummaryModalComponent, GlossaryOfTermsComponent } from './components';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';
import { BasicDataGridModule } from 'libs/features/basic-data-grid';

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
            SummaryCardEffects
        ]),
        PerfectScrollbarModule,
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
        BasicDataGridModule
    ],
  declarations: [
    // Components
    TrendingJobGroupComponent,
    CardComponent,
    AddPayMarketFormComponent,
    JobLimitCounterComponent,
    SalaryBarChartComponent,
    SalaryTrendChartComponent,
    SharePricingSummaryModalComponent,
    GlossaryOfTermsComponent,

    // Pages
    ComphubPageComponent,
    JobsCardComponent,
    MarketsCardComponent,
    CardLayoutComponent,
    SummaryCardComponent,
    PaymarketCardsComponent,
    PeerDataCardComponent,
    ParentDataCardComponent,
    QuickPriceHistoryComponent,
    ComphubFooterComponent,
    JobGridComponent
  ],
  providers: [
    WindowRef,
    CurrencyPipe,
    WindowCommunicationService,
    DojGuidelinesService
  ]
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
