import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { TileContainerComponent, TileComponent, UserVoiceIndicatorComponent } from './components';
import { TileService } from './services';

import { DashboardPageComponent } from './containers';
import { TimelineActivityComponent } from './containers/timeline-activity';
import { MainRoutingModule } from './main-routing.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    DashboardPageComponent,
    // Components
    TimelineActivityComponent,
    TileContainerComponent,
    TileComponent,
    UserVoiceIndicatorComponent,
  ],
  providers: [ TileService ]
})
export class MainModule {
}
