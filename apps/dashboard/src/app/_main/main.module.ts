import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { TileContainerComponent, TileComponent, UserVoiceIndicatorComponent } from './components';

import { OrderByPipe } from './pipes';
import { TileService } from './services';

import { DashboardPageComponent } from './containers';
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
    DashboardPageComponent, TileContainerComponent, TileComponent, UserVoiceIndicatorComponent,
    OrderByPipe
  ],
  providers: [ TileService ]
})
export class MainModule {
}
