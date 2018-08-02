import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonUIModule } from 'libs/ui/common';
import { CommunityDashboardPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';

import { CommunityPostsComponent } from './containers/community-posts/community-posts.component';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';
import { CommunityPollRequestEffects } from './effects';
import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

const components = [
  CommunityDashboardPageComponent,
  CommunityPostsComponent,
  CommunityPollsComponent
];

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    // 3rd party
    NgbCarouselModule,

    StoreModule.forFeature('communityPollRequest', reducers),
    EffectsModule.forFeature([
      CommunityPollRequestEffects
    ]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: components,
  providers: [
    CommunityPollApiService
  ]
})
export class MainModule {
}
