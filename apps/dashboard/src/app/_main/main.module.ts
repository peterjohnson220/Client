import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DragulaModule } from 'ng2-dragula';
import { ChartsModule } from '@progress/kendo-angular-charts';

// PF
import { PfCommonUIModule } from 'libs/ui/common';

// Effects
import { DashboardEffects, TileGridEffects, UserVoiceEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Routing
import { MainRoutingModule } from './main-routing.module';

// Containers
import { DashboardPageComponent } from './containers';
import { TileGridComponent } from './containers';
import { TimelineActivityComponent } from './containers';
import { UserVoiceIndicatorComponent } from './containers';

// Components
import { TileComponent } from './components';
import { TilePreviewChartComponent } from './components';
import { TilePreviewIconComponent } from './components';
import { TilePreviewListComponent } from './components';

// Pipes
import { TruncateAfterPipe } from 'libs/common/core/pipes';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    DragulaModule,
    StoreModule.forFeature('dashboardMain', reducers),
    EffectsModule.forFeature([TileGridEffects, UserVoiceEffects, DashboardEffects]),
    ChartsModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    TruncateAfterPipe,
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
