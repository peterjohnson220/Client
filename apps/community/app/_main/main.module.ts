import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common';
import { CommunityDashboardPageComponent } from './containers';
import { MainRoutingModule } from './main-routing.module';
import { PfCommonModule } from 'libs/core';
import { PfFormsModule } from 'libs/forms';

import { CommunityPostsComponent } from './containers/community-posts/community-posts.component';
import { CommunityStartDiscussionComponent } from './containers/community-start-discussion';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';
import { CommunityPostAddReplyComponent } from './containers/community-post-add-reply/community-post-add-reply.component';
import { CommunityPostRepliesComponent } from './components/community-post-replies';
import { CommunityPostReplyComponent } from './components/community-post-reply';
import { CommunityPostAddReplyViewComponent } from './containers/community-post-add-reply-view';
import { CommunityPostHeaderComponent } from './components/community-post-header';
import { CommunityLikeComponent } from './components/community-like/community-like.component';
import { CommunityAvatarComponent } from './components/community-avatar/community-avatar.component';
import { CommunityPopularTagsComponent } from './containers/community-popular-tags/community-popular-tags.component';
import { CommunityNewPostComponent } from './containers/community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from './containers/community-new-poll/community-new-poll.component';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';
import { CommunityTextAreaComponent } from './containers/community-text-area/community-text-area.component';
import { RadialTextCounterComponent } from './components/radial-text-counter/radial-text-counter.component';

import { CommunityPollRequestEffects } from './effects/community-poll-request.effects';
import { CommunityPollResponseEffects } from './effects/community-poll-response.effects';

import { CommunityPostEffects, CommunityTagEffects } from './effects';
import { CommunityPostReplyEffects } from './effects';

import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

const components = [
  CommunityDashboardPageComponent,
  CommunityPostsComponent,
  CommunityPostRepliesComponent,
  CommunityPostReplyComponent,
  CommunityPostAddReplyViewComponent,
  CommunityPostHeaderComponent,
  CommunityTextAreaComponent,
  CommunityStartDiscussionComponent,
  CommunityPollsComponent,
  CommunityPostAddReplyComponent,
  RadialTextCounterComponent,
  CommunityPopularTagsComponent,
  CommunityLikeComponent,
  CommunityAvatarComponent,
  CommunityNewPollComponent,
  CommunityNewPostComponent,
  CommunityPollChoicesComponent
];

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // 3rd party
    NgbCarouselModule,
    NgbTooltipModule,
    NgbDropdownModule,
    DropDownsModule,

    StoreModule.forFeature('community', reducers),
    EffectsModule.forFeature([
      CommunityPollRequestEffects,
      CommunityPollResponseEffects,
      CommunityPostEffects,
      CommunityPostReplyEffects,
      CommunityTagEffects
    ]),

    // Routing
    MainRoutingModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule,
    PfFormsModule
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
