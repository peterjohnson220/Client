import { NgModule } from '@angular/core';

import { PfCommonUIModule } from 'libs/ui/common';
import { CommunityDashboardPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  imports: [
    MainRoutingModule,
    PfCommonUIModule
  ],
  declarations: [
    CommunityDashboardPageComponent
  ],
  providers: []
})
export class MainModule {
}
