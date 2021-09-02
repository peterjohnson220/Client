import { forwardRef, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
import { ChartModule } from '@progress/kendo-angular-charts';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPaginationModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HighchartsChartModule } from 'highcharts-angular';

import { HumanizeNumberPipe, PfCommonModule, WindowCommunicationService, WindowRef } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { GuidelinesBadgeModule } from 'libs/features/peer/guidelines-badge';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';

import {
  JobGridComponent,
  CardLayoutComponent,
  MarketsCardComponent,
  ComphubFooterComponent,
  JobsCardWrapperComponent,
  QuickPriceHistoryComponent,
  SummaryCardComponent,
  QuickPriceLandingPageComponent
} from './containers';
import {
  PaymarketCardsComponent,
  AddPayMarketFormComponent,
  CardComponent,
  SharePricingSummaryModalComponent,
  GlossaryOfTermsComponent,
  SalaryBarChartComponent, SalaryTrendChartComponent
} from './components';
import * as fromFaIcons from './fa-icons';
import { reducers } from './reducers';
import {
  AddPayMarketFormEffects,
  ComphubPageEffects,
  DataCardEffects,
  JobGridEffects,
  JobsCardEffects,
  MarketsCardEffects, QuickPriceHistoryEffects,
  SummaryCardEffects
} from './effects';
import { ComphubPageEffectsService } from './helpers';

const declarations = [
  JobGridComponent,
  CardLayoutComponent,
  MarketsCardComponent,
  PaymarketCardsComponent,
  AddPayMarketFormComponent,
  CardComponent,
  ComphubFooterComponent,
  JobsCardWrapperComponent,
  QuickPriceHistoryComponent,
  QuickPriceLandingPageComponent,
  SummaryCardComponent,
  SharePricingSummaryModalComponent,
  GlossaryOfTermsComponent,
  SalaryBarChartComponent,
  SalaryTrendChartComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    DropDownsModule,
    GridModule,
    ChartModule,
    NgbPaginationModule,
    NgbModalModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    PDFExportModule,
    HighchartsChartModule,

    StoreModule.forFeature('comphub_shared', reducers),
    EffectsModule.forFeature([
      ComphubPageEffects,
      DataCardEffects,
      JobsCardEffects,
      MarketsCardEffects,
      SummaryCardEffects,
      AddPayMarketFormEffects,
      JobGridEffects,
      QuickPriceHistoryEffects
    ]),

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule,
    GuidelinesBadgeModule,
    BasicDataGridModule

  ],
  declarations: declarations,
  exports: declarations,
  providers: [
    WindowRef,
    CurrencyPipe,
    DatePipe,
    WindowCommunicationService,
    PercentPipe,
    HumanizeNumberPipe,
    ComphubPageEffectsService
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
