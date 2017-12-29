import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';

// PF
import { PfCommonUIModule } from 'libs/ui/common';

// Effects
import { TileGridEffects } from './effects/tile-grid.effects';
import { DashboardEffects } from './effects/dashboard.effects';

// Reducers
import { reducers } from './reducers';

// Routing
import { MainRoutingModule } from './main-routing.module';

// Containers
import { DashboardPageComponent } from './containers';
import { TileGridComponent } from './containers/tile-grid';
import { TimelineActivityComponent } from './containers/timeline-activity';

// Components
import { TileComponent } from './components/tile';
import { TilePreviewChartComponent } from './components/tile-preview/chart';
import { TilePreviewIconComponent } from './components/tile-preview/icon';
import { TilePreviewListComponent } from './components/tile-preview/list';
import { UserVoiceIndicatorComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    DragulaModule,
    StoreModule.forFeature('dashboardMain', reducers),
    EffectsModule.forFeature([TileGridEffects, DashboardEffects]),

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
    TilePreviewChartComponent,
    TilePreviewIconComponent,
    TilePreviewListComponent,
    TimelineActivityComponent,
    TileComponent,
    UserVoiceIndicatorComponent,
  ]
})
export class MainModule {
}
