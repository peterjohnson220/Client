import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import {NgbPopoverModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import 'hammerjs';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfNgBootstrapExtensionModule } from 'libs/extensions/ng-bootstrap';

import { RedirectToExchangeComponent } from './components';
import {
  ExchangeDashboardPageComponent, NoExchangesPageComponent, ExchangeSelectorComponent,
  AccessModalComponent, ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
  ExchangeRevenueChartComponent, ExchangeCompanyCountComponent, ExchangeJobCountComponent,
  ChartDetailComponent, ExchangeJobComparisonGridComponent
} from './containers';
import { ExchangeDashboardEffects, AccessExchangeRequestEffects, ExchangeSelectorEffects,
         InviteCompanyEffects, ExchangeJobComparisonGridEffects, ExchangeEffects } from './effects';
import { ExchangeExistsGuard } from '../shared/guards';
import { reducers } from './reducers';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import {InviteCompanyModalComponent} from './containers/invite-company/invite-company-modal';
import {NewCompanyFormComponent} from './containers/invite-company/new-company-form';
import {ExistingCompanySelectionFormComponent} from './containers/invite-company/existing-company-selection-form';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    NgbTooltipModule,
    DropDownsModule,
    ChartModule,
    GridModule,
    StoreModule.forFeature('peer_dashboard', reducers),
    EffectsModule.forFeature([
      ExchangeDashboardEffects, AccessExchangeRequestEffects, ExchangeSelectorEffects,
      InviteCompanyEffects, ExchangeJobComparisonGridEffects, ExchangeEffects
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
    AccessModalComponent, ChartDetailComponent, ExchangeJobComparisonGridComponent, ExchangeSelectorComponent,
    InviteCompanyModalComponent, NewCompanyFormComponent, ExistingCompanySelectionFormComponent,

    // Pages
    NoExchangesPageComponent
  ],
  providers: [
    ExchangeExistsGuard
  ]
})
export class DashboardModule { }
