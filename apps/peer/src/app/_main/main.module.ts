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

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent,
         AvailableExchangeResultComponent } from './components';
import { ExchangeListPageComponent, ExchangeJobMappingPageComponent,
         ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent,
         ExchangeDashboardPageComponent, ReferCompanyModalComponent,
         RequestExchangeAccessModalComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingGridEffects,
         ExchangeJobMappingInfoEffects, ExchangeDashboardEffects,
         ExchangeAccessEffects, ExistingCompaniesEffects } from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { MainRoutingModule } from './main-routing.module';
import { ExchangeRequestEffectsService } from './services/exchange-request-effects.service';

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
      ExchangeJobMappingInfoEffects, ExchangeAccessEffects, ExistingCompaniesEffects
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
    AvailableExchangeResultComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent, ExchangeDashboardPageComponent,
    RequestExchangeAccessModalComponent, ReferCompanyModalComponent,

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








