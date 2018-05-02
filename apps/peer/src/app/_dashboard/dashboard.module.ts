import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import 'hammerjs';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfPeerFeaturesModule } from 'libs/features';
import { PfCommonModule } from 'libs/core';

import { ExchangeListPageComponent, ExchangeDashboardPageComponent, PayfactorsCompanyModalComponent,
         AccessModalComponent, ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
         ExchangeRevenueChartComponent, ExchangeCompanyCountComponent, ExchangeJobCountComponent,
         ChartDetailComponent} from './containers';
import { ExchangeListEffects, ExchangeDashboardEffects, AccessExchangeRequestEffects,
         PayfactorsCompanyExchangeRequestEffects } from './effects';
import { ExchangeExistsGuard } from '../shared/guards';
import { reducers } from './reducers';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ExchangeJobComparisonGridEffects } from './effects/exchange-job-comparison-grid.effects';
import { ExchangeJobComparisonGridComponent } from './containers/exchange-job-comparison-grid/exchange-job-comparison-grid.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    DropDownsModule,
    ChartModule,
    GridModule,
    StoreModule.forFeature('peer_dashboard', reducers),
    EffectsModule.forFeature([
      ExchangeListEffects, ExchangeDashboardEffects, AccessExchangeRequestEffects,
      PayfactorsCompanyExchangeRequestEffects, ExchangeJobComparisonGridEffects
    ]),

    // Routing
    DashboardRoutingModule,

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    PfPeerFeaturesModule,
    PfFormsModule,
    PfCommonModule
  ],
  declarations: [
    // Containers
    ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent, ExchangeRevenueChartComponent,
    ExchangeCompanyCountComponent, ExchangeJobCountComponent, ExchangeDashboardPageComponent,
    PayfactorsCompanyModalComponent, AccessModalComponent, ChartDetailComponent, ExchangeJobComparisonGridComponent,

    // Pages
    ExchangeListPageComponent
  ],
  providers: [
    ExchangeExistsGuard
  ]
})
export class DashboardModule { }
