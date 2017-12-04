import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

import { DashboardPageComponent } from './containers';
import { DashboardEffects } from './effects/dashboard.effects';
import { reducers } from './reducers';
import { MainRoutingModule } from './main-routing.module';
import { TileGridComponent } from './components/tile-grid';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('dashboard', reducers),
    EffectsModule.forFeature([DashboardEffects]),

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
