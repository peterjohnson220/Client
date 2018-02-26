import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';

import { CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent } from './components';
import { ExchangeListPageComponent, ExchangeJobMappingPageComponent,
         ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects } from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { MainRoutingModule } from './main-routing.module';
import { RequestExchangeAccessModalComponent } from './containers/request-access-modal/request-exchange-access-modal.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peerMain', reducers),
    EffectsModule.forFeature([ExchangeJobMappingGridEffects, ExchangeListEffects, ExchangeJobMappingInfoEffects]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfSharedPeerModule,
    PfFormsModule,
    PfKendoExtensions
  ],
  declarations: [
    // Components
    CompanyJobMapResultComponent, JobInfoContainerComponent, ApplyMappingButtonComponent,

    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent,
    RequestExchangeAccessModalComponent,

    // Pages
    ExchangeListPageComponent, ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class MainModule { }








