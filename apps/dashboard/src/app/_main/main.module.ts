import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import { DashboardPageComponent } from './containers';
import { TileGridEffects } from './effects/tile-grid.effects';
import { reducers } from './reducers/tile-grid';
import { MainRoutingModule } from './main-routing.module';
import { TileComponent } from './components/tile/tile.component';
import { TileGridComponent } from './containers/tile-grid';
import { TileEmployeesComponent } from './components/tile/employees';
import { TileDataInsightsComponent } from './components/tile/data-insights';

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
    TileComponent,
    TileGridComponent,
    TileEmployeesComponent,
    TileDataInsightsComponent
  ]
})
export class MainModule { }
