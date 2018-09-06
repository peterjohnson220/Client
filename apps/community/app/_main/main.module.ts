import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonUIModule } from 'libs/ui/common';
import { CommunityDashboardPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import { PfCommonModule } from 'libs/core';

import { CommunityPostsComponent } from './containers/community-posts/community-posts.component';
import { CommunityStartDiscussionComponent } from './containers/community-start-discussion';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';
import { CommunityPostAddReplyComponent } from './containers/community-post-add-reply/community-post-add-reply.component';
import { RadialTextCounterComponent, CommunityPostsRepliesComponent } from './components';
import { CommunityPollRequestEffects } from './effects/community-poll-request.effects';
import { CommunityPollResponseEffects } from './effects/community-poll-response.effects';

import { CommunityPostEffects } from './effects';
import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';


const components = [
  CommunityDashboardPageComponent,
  CommunityPostsComponent,
  CommunityStartDiscussionComponent,
  CommunityPollsComponent,
  CommunityPostAddReplyComponent,
  RadialTextCounterComponent,
  CommunityPostsRepliesComponent
];

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // 3rd party
    NgbCarouselModule,
    NgbTooltipModule,


    StoreModule.forFeature('community', reducers),
    EffectsModule.forFeature([
      CommunityPollRequestEffects,
      CommunityPollResponseEffects,
      CommunityPostEffects
    ]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule
  ],
  declarations: components,
  providers: [
    CommunityPollApiService,
    CommunityPostApiService
  ]
})
export class MainModule {
}
