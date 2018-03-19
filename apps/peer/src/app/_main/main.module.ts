import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';
import { PfCommonModule } from 'libs/core';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import { ExchangeListPageComponent, ExchangeJobMappingPageComponent,
         ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent, ExchangeDashboardPageComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, ExchangeDashboardEffects } from './effects';
import { ExchangeExistsGuard } from './guards';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { MainRoutingModule } from './main-routing.module';
import { RequestExchangeAccessModalComponent } from './containers/request-access-modal/request-exchange-access-modal.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AvailableExchangeResultComponent } from './components/available-exchange-result/available-exchange-result.component';
import { ExchangeAccessEffects } from './effects/exchange-access.effects';

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
      ExchangeJobMappingInfoEffects, ExchangeAccessEffects
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
    RequestExchangeAccessModalComponent,

    // Pages
    ExchangeListPageComponent, ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService,
    ExchangeExistsGuard
  ]
})
export class MainModule { }








