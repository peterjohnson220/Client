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
import { SaveExchangeScopeModule } from 'libs/features/peer/save-exchange-scope/save-exchange-scope.module';

import { MapRoutingModule } from './map-routing.module';

import {
  ExportDataCutsModalComponent,
  ExchangeMapPageComponent
} from './containers';
import { ExchangeCompanyJobsGridEffects, ExportDataCutsEffects } from './effects';
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
      ExchangeCompanyJobsGridEffects, ExportDataCutsEffects
    ]),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfExchangeExplorerModule,
    SaveExchangeScopeModule
  ],
  declarations: [
    // Pages
    ExchangeMapPageComponent, ExchangeMapPageComponent,

    // Containers
     ExportDataCutsModalComponent
  ]
})
export class MapModule { }
