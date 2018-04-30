import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { SharedModule } from '../shared/shared.module';
import { ExchangeMapPageComponent } from './containers';
import { MapRoutingModule } from './map-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    // GridModule,
    // StoreModule.forFeature('peerManagement', reducers),
    // EffectsModule.forFeature([
    //  ExchangeJobMappingGridEffects, ExchangeJobMappingInfoEffects, PayfactorsJobExchangeRequestEffects
    // ]),
    // DropDownsModule,

    // Routing
    MapRoutingModule,

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    // PfPeerFeaturesModule,
    // PfFormsModule,
    // PfKendoExtensions,
    // PfCommonModule
  ],
  declarations: [
    // Pages
    ExchangeMapPageComponent
  ]
})
export class MapModule { }
