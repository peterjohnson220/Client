import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfPeerMapModule } from 'libs/features/peer/map';

import { SharedModule } from '../shared/shared.module';
import { ExchangeMapPageComponent } from './containers';
import { MapRoutingModule } from './map-routing.module';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    MapRoutingModule,

    // Payfactors
    SharedModule,
    PfCommonUIModule,
    PfPeerMapModule,
  ],
  declarations: [
    // Pages
    ExchangeMapPageComponent
  ]
})
export class MapModule { }
