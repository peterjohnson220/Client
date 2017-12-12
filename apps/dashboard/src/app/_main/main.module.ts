import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

// Effects
import { TileGridEffects } from './effects/tile-grid.effects';

// Reducers
import { reducers } from './reducers';

// Containers
import { DashboardPageComponent } from './containers';
import { TileGridComponent } from './containers/tile-grid';
import { TimelineActivityComponent } from './containers/timeline-activity';

// Components
import { TileComponent } from './components/tile/tile.component';
import { TileEmployeesComponent } from './components/tile/employees';
import { TileDataInsightsComponent } from './components/tile/data-insights';
import { UserVoiceIndicatorComponent } from './components';

// Routing
import { MainRoutingModule } from './main-routing.module';

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
    // Components
    TileComponent,
    TileGridComponent,
    TileDataInsightsComponent,
    TileEmployeesComponent,
    TimelineActivityComponent,
    UserVoiceIndicatorComponent
  ]
})
export class MainModule {
}
