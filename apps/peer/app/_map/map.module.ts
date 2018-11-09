import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfPeerMapModule } from 'libs/features/peer/map';
import { PfFormsModule } from 'libs/forms';

import { SharedModule } from '../shared/shared.module';
import { MapRoutingModule } from './map-routing.module';

import { ExchangeMapPageComponent, SaveExchangeScopeModalComponent, ExportDataCutsModalComponent } from './containers';
import { ExchangeScopeEffects, ExchangeCompanyJobsGridEffects, ExportDataCutsEffects } from './effects';
import { reducers } from './reducers';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Routing
    MapRoutingModule,

    // 3rd Party
    GridModule,
    StoreModule.forFeature('peer_map', reducers),
    EffectsModule.forFeature([
      ExchangeScopeEffects, ExchangeCompanyJobsGridEffects, ExportDataCutsEffects
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
    SaveExchangeScopeModalComponent, ExportDataCutsModalComponent
  ]
})
export class MapModule { }
