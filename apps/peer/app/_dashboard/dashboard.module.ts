import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import 'hammerjs';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfNgBootstrapExtensionModule } from 'libs/extensions/ng-bootstrap';

import { RedirectToExchangeComponent } from './components';
import {
  ExchangeDashboardPageComponent, PayfactorsCompanyModalComponent,
  AccessModalComponent, ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
  ExchangeRevenueChartComponent, ExchangeCompanyCountComponent, ExchangeJobCountComponent,
  ChartDetailComponent, ExchangeJobComparisonGridComponent, ExchangeSelectorComponent, NoExchangesPageComponent
} from './containers';
import { ExchangeDashboardEffects, AccessExchangeRequestEffects, ExchangeSelectorEffects,
         PayfactorsCompanyExchangeRequestEffects, ExchangeJobComparisonGridEffects, ExchangeEffects } from './effects';
import { ExchangeExistsGuard } from '../shared/guards';
import { reducers } from './reducers';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';


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
      ExchangeDashboardEffects, AccessExchangeRequestEffects, ExchangeSelectorEffects,
      PayfactorsCompanyExchangeRequestEffects, ExchangeJobComparisonGridEffects, ExchangeEffects
    ]),
    NgbPopoverModule,

    // Routing
    DashboardRoutingModule,

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,
    PfNgBootstrapExtensionModule
  ],
  declarations: [
    // Components
    RedirectToExchangeComponent,

    // Containers
    ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent, ExchangeRevenueChartComponent,
    ExchangeCompanyCountComponent, ExchangeJobCountComponent, ExchangeDashboardPageComponent,
    PayfactorsCompanyModalComponent, AccessModalComponent, ChartDetailComponent, ExchangeJobComparisonGridComponent,
    ExchangeSelectorComponent,

    // Pages
    NoExchangesPageComponent
  ],
  providers: [
    ExchangeExistsGuard
  ]
})
export class DashboardModule { }
