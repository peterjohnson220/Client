import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PfCommonUIModule } from 'libs/ui/common';
import { CommunityDashboardPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import { CommunityPostsComponent } from './containers/community-posts/community-posts.component';


@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    PfCommonUIModule
  ],
  declarations: [
    CommunityDashboardPageComponent,
    CommunityPostsComponent
  ],
  providers: []
})
export class MainModule {
}
