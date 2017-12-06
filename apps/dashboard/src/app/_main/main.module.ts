import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';

import { DashboardPageComponent } from './containers';
import { TimelinePanelComponent, TimelineActivityComponent } from './containers/timeline-activity';
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
    TimelinePanelComponent,
    TimelineActivityComponent
  ]
})
export class MainModule { }
