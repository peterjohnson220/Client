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
import { CommunityTextAreaComponent } from './containers/community-text-area/community-text-area.component';

import { CommunityPostAddReplyComponent } from './containers/community-post-add-reply/community-post-add-reply.component';
import { RadialTextCounterComponent } from './components';
import { CommunityPostRepliesComponent } from './components/community-post-replies';
import { CommunityPostHeaderComponent } from './components/commumity-post-header';

import { CommunityPopularTagsComponent } from './containers/community-popular-tags/community-popular-tags.component';
import { CommunityPollRequestEffects } from './effects/community-poll-request.effects';
import { CommunityPollResponseEffects } from './effects/community-poll-response.effects';
import { CommunityTagEffects } from './effects/community-tag.effects';
import { CommunityPostEffects } from './effects';

import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';


const components = [
  CommunityDashboardPageComponent,
  CommunityPostsComponent,
  CommunityPostRepliesComponent,
  CommunityPostHeaderComponent,
  CommunityTextAreaComponent,
  CommunityStartDiscussionComponent,
  CommunityPollsComponent,
  CommunityPostAddReplyComponent,
  RadialTextCounterComponent,
  CommunityPopularTagsComponent
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
      CommunityPostEffects,
      CommunityTagEffects
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
    CommunityPostApiService,
    CommunityTagApiService
  ]
})
export class MainModule {
}
