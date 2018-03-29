import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';
import { PfCommonModule } from 'libs/core';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import { ExchangeListPageComponent, ExchangeJobMappingPageComponent,
         ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent,
         ExchangeDashboardPageComponent, PayfactorsCompanyModalComponent,
         AccessModalComponent, ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
         ExchangeRevenueChartComponent, ChartDetailComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingGridEffects,
         ExchangeJobMappingInfoEffects, ExchangeDashboardEffects } from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { MainRoutingModule } from './main-routing.module';
import { ExchangeRequestEffectsService } from './services/exchange-request-effects.service';
import { AccessExchangeRequestEffects } from './effects/exchange-request/access.effects';
import { PayfactorsCompanyExchangeRequestEffects } from './effects/exchange-request/payfactors-company.effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    ChartsModule,
    GridModule,
    StoreModule.forFeature('peerMain', reducers),
    EffectsModule.forFeature([
      ExchangeJobMappingGridEffects, ExchangeListEffects, ExchangeDashboardEffects,
      ExchangeJobMappingInfoEffects, AccessExchangeRequestEffects, PayfactorsCompanyExchangeRequestEffects
    ]),
    DropDownsModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfSharedPeerModule,
    PfFormsModule,
    PfKendoExtensions,
    PfCommonModule
  ],
  declarations: [
    // Components
    CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent,
    ExchangeIndustryChartComponent, ExchangeJobFamilyChartComponent,
    ExchangeRevenueChartComponent, ChartDetailComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent, ExchangeDashboardPageComponent,
    PayfactorsCompanyModalComponent, AccessModalComponent,

    // Pages
    ExchangeListPageComponent, ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService,
    ExchangeExistsGuard,
    ExchangeRequestEffectsService
  ]
})
export class MainModule { }








