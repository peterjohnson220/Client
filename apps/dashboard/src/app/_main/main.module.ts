import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { TileComponent, UserVoiceIndicatorComponent, JobDescriptionsComponent } from './components';
import { TileService } from './services';
import { DashboardPageComponent, TileGridComponent } from './containers';
import { TimelineActivityComponent } from './containers/timeline-activity';
import { MainRoutingModule } from './main-routing.module';
import { ChartsModule } from '@progress/kendo-angular-charts';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd party
    ChartsModule,

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    DashboardPageComponent,

    // Containers
    TileGridComponent,

    // Components
    TileComponent,
    TimelineActivityComponent,
    UserVoiceIndicatorComponent,
    JobDescriptionsComponent
  ],
  providers: [ TileService ]
})
export class MainModule {
}
