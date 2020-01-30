import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import 'hammerjs';

import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfCommonModule } from 'libs/core';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';

import {
  ExchangeDashboardPageComponent, AccessModalComponent, ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
  ExchangeRevenueChartComponent, ExchangeCompanyCountComponent, ExchangeJobCountComponent,
  ChartDetailComponent, ExchangeJobComparisonGridComponent, ExchangeDashboardTCModalComponent, UploadOrgDataModalComponent
} from './containers';
import {
  ExchangeDashboardEffects, AccessExchangeRequestEffects, InviteCompanyEffects, ExchangeJobComparisonGridEffects,
  ExchangeEffects, ExchangeDashboardTCModalEffects, UploadOrgDataEffects
} from './effects';
import { ExchangeExistsGuard } from '../shared/guards';
import { reducers } from './reducers';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { InviteCompanyModalComponent } from './containers/invite-company/invite-company-modal';
import { NewCompanyFormComponent } from './containers/invite-company/new-company-form';
import { ExistingCompanySelectionFormComponent } from './containers/invite-company/existing-company-selection-form';

import * as fromFaIcons from './fa-icons';
import { SharedModule } from '../shared/shared.module';

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
    UploadModule,
    StoreModule.forFeature('peer_dashboard', reducers),
    EffectsModule.forFeature([
      ExchangeDashboardEffects, AccessExchangeRequestEffects, InviteCompanyEffects,
      ExchangeJobComparisonGridEffects, ExchangeEffects, ExchangeDashboardTCModalEffects, UploadOrgDataEffects
    ]),
    FontAwesomeModule,

    // Routing
    DashboardRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,
    SharedModule,
    PfExchangeExplorerModule
  ],
  declarations: [
// Containers
    ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent, ExchangeRevenueChartComponent,
    ExchangeCompanyCountComponent, ExchangeJobCountComponent, ExchangeDashboardPageComponent,
    AccessModalComponent, ChartDetailComponent, ExchangeJobComparisonGridComponent,
    InviteCompanyModalComponent, NewCompanyFormComponent, ExistingCompanySelectionFormComponent,
    ExchangeDashboardTCModalComponent, UploadOrgDataModalComponent
  ],
  providers: [
    ExchangeExistsGuard
  ]
})
export class DashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
