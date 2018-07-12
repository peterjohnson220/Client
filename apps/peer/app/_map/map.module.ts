import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfPeerMapModule } from 'libs/features/peer/map';
import { PfFormsModule } from 'libs/forms';

import { SharedModule } from '../shared/shared.module';
import { ExchangeMapPageComponent } from './containers';
import { MapRoutingModule } from './map-routing.module';

import { ExchangeScopeEffects } from './effects';
import { reducers } from './reducers';
import { SaveExchangeScopeModalComponent } from './containers/save-exchange-scope-modal';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Routing
    MapRoutingModule,

    // 3rd Party
    StoreModule.forFeature('peer_map', reducers),
    EffectsModule.forFeature([
      ExchangeScopeEffects
    ]),

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    PfFormsModule,
    PfPeerMapModule,
  ],
  declarations: [
    // Pages
    ExchangeMapPageComponent,

    // Containers
    SaveExchangeScopeModalComponent
  ]
})
export class MapModule { }
