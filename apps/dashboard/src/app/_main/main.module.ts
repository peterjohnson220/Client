import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import { DashboardPageComponent } from './containers';
import { TileGridEffects } from './effects/tile-grid.effects';
import { reducers } from './reducers/tile-grid';
import { MainRoutingModule } from './main-routing.module';
import { TileGridComponent } from './containers/tile-grid';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('tileGrid', reducers),
    EffectsModule.forFeature([TileGridEffects]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    DashboardPageComponent,
    TileGridComponent
  ]
})
export class MainModule { }
