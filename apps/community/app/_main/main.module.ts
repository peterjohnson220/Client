import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {ScrollDispatchModule, ScrollingModule} from '@angular/cdk/scrolling';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

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
import { CommunityCategoriesComponent } from './containers/community-categories';
import { CommunityPostRepliesComponent } from './components/community-post-replies';
import { CommunityPostReplyComponent } from './components/community-post-reply';
import { CommunityPostAddReplyViewComponent } from './containers/community-post-add-reply-view';
import { CommunityPostFilteredReplyViewComponent } from './containers/community-post-filtered-reply-view';
import { CommunityPostHeaderComponent } from './components/community-post-header';
import { CommunityLikeComponent } from './components/community-like/community-like.component';
import { CommunityAvatarComponent } from './components/community-avatar/community-avatar.component';
import { CommunityNewPostComponent } from './containers/community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from './containers/community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from './containers/community-new-job/community-new-job.component';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';
import { CommunityTextAreaComponent } from './containers/community-text-area/community-text-area.component';
import { CommunityPostContentComponent } from './components/community-post-content/community-post-content.component';
import { RadialTextCounterComponent } from './components/radial-text-counter/radial-text-counter.component';
import { CommunityPollComponent } from './components/community-poll/community-poll.component';
import { CommunityJobComponent } from './components/community-job/community-job.component';
import { CommunityJobsComponent } from './containers/community-jobs/community-jobs.component';
import { CommunityTabComponent } from './components/community-tab/community-tab.component';
import { CommunityBackToTopNavigationComponent } from './components/community-back-to-top-navigation';
import { CommunityPollRequestEffects } from './effects/community-poll-request.effects';
import { CommunityPollResponseEffects } from './effects/community-poll-response.effects';
import { CommunityCategoriesEffects } from './effects/community-categories.effects';
import { CommunityPostFilterOptionsEffects } from './effects/community-post-filter-options.effects';
import { CommunityTrendingAndFilteredTagsComponent } from './containers/community-trending-and-filtered-tags';
import { CommunitySearchComponent } from './components/community-search/community-search.component';
import {CommunitySearchResultsComponent} from './containers/community-search-results/community-search-results.component';
import {CommunitySearchResultHeaderComponent} from './components/community-search-result-header';
import {CommunitySearchResultContentComponent} from './components/community-search-result-content';
import { CommunityPostComponent } from './components/community-post/community-post.component';
import { CommunitySearchResultModalComponent } from './containers/community-search-result-modal/community-search-result-modal.component';

import { CommunityPostEffects, CommunityTagEffects, CommunityPostReplyEffects, CommunityJobEffects, CommunityLikeEffects } from './effects';
import { CommunityJobEffectsService } from './services/community-job-effects-service';
import { CommunityPostEffectsService } from './services/community-post-effects-service';
import { PfLinkifyService } from './services/pf-linkify-service';

import { reducers } from './reducers';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';
import { CommunityJobApiService } from 'libs/data/payfactors-api/community/community-job-api.service';
import { MapboxApiService } from 'libs/data/mapbox-api/mapbox-api.service';
import { BrowserDetectionService} from 'libs/core/services';
import { CommunityCategoriesApiService } from 'libs/data/payfactors-api/community/community-categories-api.service';
import { CommunityCategoryDisplayNamePipe } from './pipes/community-category-displayname.pipe';
import {CommunityContentEllipsisPipe} from './pipes/community-content-ellipsis.pipe';
import { ClickInContentDirective } from './directives/click-in-content-directive';
import { CommunitySearchResultsPageComponent } from './containers/pages/community-search-results/community-search-results.page';
import { CommunitySearchEffects } from './effects/community-search.effects';
import { CommunitySearchApiService } from 'libs/data/payfactors-api/community/community-search-api.service';

const components = [
  ClickInContentDirective,
  CommunityDashboardPageComponent,
  CommunityJobPostingsPageComponent,
  CommunitySearchResultsPageComponent,
  CommunityPostsComponent,
  CommunityPostRepliesComponent,
  CommunityPostReplyComponent,
  CommunityPostAddReplyViewComponent,
  CommunityPostFilteredReplyViewComponent,
  CommunityPostHeaderComponent,
  CommunityTextAreaComponent,
  CommunityPostContentComponent,
  CommunityStartDiscussionComponent,
  CommunityPollsComponent,
  CommunityPostAddReplyComponent,
  RadialTextCounterComponent,
  CommunityBackToTopNavigationComponent,
  CommunityLikeComponent,
  CommunityAvatarComponent,
  CommunityNewPollComponent,
  CommunityNewPostComponent,
  CommunityPollChoicesComponent,
  CommunityPollComponent,
  CommunityNewJobComponent,
  CommunityCategoriesComponent,
  CommunityCategoryDisplayNamePipe,
  CommunityContentEllipsisPipe,
  CommunityJobComponent,
  CommunityJobsComponent,
  CommunityTabComponent,
  CommunityTrendingAndFilteredTagsComponent,
  CommunitySearchComponent,
  CommunitySearchResultsComponent,
  CommunitySearchResultHeaderComponent,
  CommunitySearchResultContentComponent,
  CommunitySearchResultModalComponent,
  CommunityPostComponent
];

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // 3rd party
    NgbCarouselModule,
    NgxLinkifyjsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    DropDownsModule,
    InfiniteScrollModule,
    ScrollingModule,
    ScrollDispatchModule,

    StoreModule.forFeature('community', reducers),
    EffectsModule.forFeature([
      CommunityPollRequestEffects,
      CommunityPollResponseEffects,
      CommunityPostEffects,
      CommunityPostReplyEffects,
      CommunityTagEffects,
      CommunityJobEffects,
      CommunityCategoriesEffects,
      CommunityPostFilterOptionsEffects,
      CommunityLikeEffects,
      CommunitySearchEffects
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
    CommunityJobApiService,
    CommunityCategoriesApiService,
    CommunityJobEffectsService,
    CommunityPostEffectsService,
    MapboxApiService,
    PfLinkifyService,
    BrowserDetectionService,
    CommunitySearchApiService
  ]
})
export class MainModule {
}
