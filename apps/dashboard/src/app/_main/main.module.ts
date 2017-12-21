import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PfCommonUIModule } from 'libs/ui/common';

// Effects
import { TileGridEffects } from './effects/tile-grid.effects';
import { UserVoiceEffects } from './effects/user-voice.effects';
// Reducers
import { reducers } from './reducers';

// Routing
import { MainRoutingModule } from './main-routing.module';

// Containers
import { DashboardPageComponent } from './containers';
import { TileGridComponent } from './containers/tile-grid';
import { TimelineActivityComponent } from './containers/timeline-activity';
import { UserVoiceIndicatorComponent } from './containers/user-voice';

// Components
import { TileComponent } from './components/tile';
import { TilePreviewChartComponent } from './components/tile-preview/chart';
import { TilePreviewIconComponent } from './components/tile-preview/icon';
import { TilePreviewListComponent } from './components/tile-preview/list';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    StoreModule.forFeature('dashboardMain', reducers),
    EffectsModule.forFeature([TileGridEffects, UserVoiceEffects]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    DashboardPageComponent,
    // Components
    UserVoiceIndicatorComponent,
    TileComponent,
    TileGridComponent,
    TilePreviewChartComponent,
    TilePreviewIconComponent,
    TilePreviewListComponent,
    TimelineActivityComponent,
    TileComponent,
  ]
})
export class MainModule {
}
