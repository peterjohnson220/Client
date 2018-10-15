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
import { CommunityJobPostingsPageComponent } from './containers';
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
import { CommunityPostFilteredReplyViewComponent } from './containers/community-post-filtered-reply-view';
import { CommunityPostHeaderComponent } from './components/community-post-header';
import { CommunityLikeComponent } from './components/community-like/community-like.component';
import { CommunityAvatarComponent } from './components/community-avatar/community-avatar.component';
import { CommunityPopularTagsComponent } from './containers/community-popular-tags/community-popular-tags.component';
import { CommunityNewPostComponent } from './containers/community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from './containers/community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from './containers/community-new-job/community-new-job.component';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';
import { CommunityTextAreaComponent } from './containers/community-text-area/community-text-area.component';
import { RadialTextCounterComponent } from './components/radial-text-counter/radial-text-counter.component';
import { CommunityPollComponent } from './components/community-poll/community-poll.component';
import { CommunityPostTagFilterComponent} from './components/community-tag-filter';

import { CommunityPollRequestEffects } from './effects/community-poll-request.effects';
import { CommunityPollResponseEffects } from './effects/community-poll-response.effects';

import { CommunityPostEffects, CommunityTagEffects, CommunityPostReplyEffects, CommunityJobEffects } from './effects';

import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';
import { CommunityJobApiService } from 'libs/data/payfactors-api/community/community-job-api.service';

const components = [
  CommunityDashboardPageComponent,
  CommunityJobPostingsPageComponent,
  CommunityPostsComponent,
  CommunityPostRepliesComponent,
  CommunityPostReplyComponent,
  CommunityPostAddReplyViewComponent,
  CommunityPostFilteredReplyViewComponent,
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
  CommunityPollChoicesComponent,
  CommunityPollComponent,
  CommunityPostTagFilterComponent,
  CommunityNewJobComponent
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
      CommunityTagEffects,
      CommunityJobEffects
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
    CommunityTagApiService,
    CommunityJobApiService
  ]
})
export class MainModule {
}
