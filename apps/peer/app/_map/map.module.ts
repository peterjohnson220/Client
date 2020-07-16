import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfExchangeExplorerModule } from 'libs/features/peer/exchange-explorer';

import { MapRoutingModule } from './map-routing.module';

import {
  ExportDataCutsModalComponent,
  ExchangeMapPageComponent,
  SaveExchangeScopeModalComponent
} from './containers';
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
    DropDownListModule,
    StoreModule.forFeature('peer_map', reducers),
    EffectsModule.forFeature([
      ExchangeScopeEffects, ExchangeCompanyJobsGridEffects, ExportDataCutsEffects
    ]),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfExchangeExplorerModule
  ],
  declarations: [
    // Pages
    ExchangeMapPageComponent, ExchangeMapPageComponent,

    // Containers
    SaveExchangeScopeModalComponent, SaveExchangeScopeModalComponent, ExportDataCutsModalComponent
  ]
})
export class MapModule { }
