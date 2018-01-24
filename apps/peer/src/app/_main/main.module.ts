import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { StoreModule } from '@ngrx/store';

import { PfKendoExtensions } from 'libs/extensions';
import { PfFormsModule } from 'libs/forms';
import { PfCommonUIModule } from 'libs/ui/common';
import { PfSharedPeerModule } from 'libs/features';

import { ExchangeListPageComponent, ExchangeJobMappingPageComponent,
         ExchangeJobMappingInfoComponent, ExchangeJobMappingGridComponent } from './containers';
import { ExchangeListEffects, ExchangeJobMappingEffects } from './effects';
import { reducers } from './reducers';
import { ExchangeJobMappingService } from './services';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    GridModule,
    StoreModule.forFeature('peerMain', reducers),
    EffectsModule.forFeature([ExchangeJobMappingEffects, ExchangeListEffects]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfSharedPeerModule,
    PfFormsModule,
    PfKendoExtensions
  ],
  declarations: [
    // Containers
    ExchangeJobMappingGridComponent, ExchangeJobMappingInfoComponent,

    // Pages
    ExchangeListPageComponent, ExchangeJobMappingPageComponent
  ],
  providers: [
    ExchangeJobMappingService
  ]
})
export class MainModule { }








