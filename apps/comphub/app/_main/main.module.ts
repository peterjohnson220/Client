import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
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

import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';
import { BasicDataGridModule } from 'libs/features/grids/basic-data-grid';
import { PfDataGridModule } from 'libs/features/grids/pf-data-grid';

import { SharedModule } from '../_shared/shared.module';

import {
  JobsCardComponent,
  PeerDataCardComponent,
  ParentDataCardComponent,
  MarketDataJobResultsComponent,
  PeerJobResultsComponent,
  QuickPricePageComponent
} from './containers';
import {  TrendingJobGroupComponent, JobsGridContentComponent } from './components';
import { MainRoutingModule } from './main-routing.module';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    PerfectScrollbarModule,
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
    BasicDataGridModule,
    SharedModule,
    PfDataGridModule
  ],
  declarations: [
    // Components
    TrendingJobGroupComponent,

    // Pages
    JobsCardComponent,
    PeerDataCardComponent,
    ParentDataCardComponent,
    MarketDataJobResultsComponent,
    PeerJobResultsComponent,
    JobsGridContentComponent,
    QuickPricePageComponent
  ],
  exports: []
})
export class MainModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
