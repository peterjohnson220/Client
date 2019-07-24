import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/combineLatest';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';

import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';

import * as fromCommunityPostAddReplyViewReducer from '../../reducers';

import * as fromCommunityIndustryActions from '../../actions/community-industry.actions';
import * as fromCommunityCompanySizeActions from '../../actions/community-company-size.actions';

import { CommunityPost } from 'libs/models/community';
import { environment } from 'environments/environment';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityTag } from 'libs/models/community/community-tag.model';
import { Tag } from '../../models/tag.model';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';
import { CommunityCompanySizeBucket } from 'libs/models/community/community-company-size-bucket.model';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: [ './community-posts.component.scss' ]
})
export class CommunityPostsComponent implements OnInit, OnDestroy {
  @Output() filtersModifiedEvent = new EventEmitter();

  avatarUrl = environment.avatarSource;
  communityPosts$: Observable<CommunityPost[]>;
  maximumReplies$: Observable<number>;
  loadingCommunityPosts$: Observable<boolean>;
  loadingNextBatchCommunityPosts$: Observable<boolean>;
  loadingPreviousBatchCommunityPosts$: Observable<boolean>;
  getHasNextBatchPostsOnServer$: Observable<boolean>;
  getHasPreviousBatchPostsOnServer$: Observable<boolean>;
  filteredByPost$: Observable<boolean>;
  totalDiscussionResultsOnServer$: Observable<number>;
  communityIndustries$: Observable<string[]>;
  communityCompanySizes$: Observable<CommunityCompanySizeBucket[]>;

  communityPosts: CommunityPost[];
  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  communityPostsSubscription: Subscription;
  loadingNextBatchCommunityPostsSubscription: Subscription;
  loadingPreviousBatchCommunityPostsSubscription: Subscription;
  hasNextBatchResultsOnServerSubscription: Subscription;
  hasPreviousBatchResultsOnServerSubscription: Subscription;

  loadingNextBatchCommunityPosts: boolean;
  loadingPreviousBatchCommunityPosts: boolean;
  hasNextBatchOnServer: boolean;
  hasPreviousBatchOnServer: boolean;


  constructor(private route: ActivatedRoute,
              public store: Store<fromCommunityPostReducer.State>,
              public replyStore: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>,
              public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>) {

    this.communityPosts$ = this.store.select(fromCommunityPostReducer.getCommunityPostsCombinedWithReplies);
    this.maximumReplies$ = this.store.select(fromCommunityPostReducer.getMaximumReplies);

    this.loadingCommunityPosts$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPosts);
    this.loadingNextBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingNextBatchPosts);
    this.loadingPreviousBatchCommunityPosts$ = this.store.select(fromCommunityPostReducer.getLoadingPreviousBatchPosts);
    this.totalDiscussionResultsOnServer$ = this.store.select(fromCommunityPostReducer.getTotalDiscussionResultsOnServer);
    this.getHasNextBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasNextBatchPostsOnServer);
    this.getHasPreviousBatchPostsOnServer$ = this.store.select(fromCommunityPostReducer.getHasPreviousBatchPostsOnServer);
    this.filteredByPost$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getFilteredByPost);
    this.communityIndustries$ = this.store.select(fromCommunityPostReducer.getCommunityIndustries);
    this.communityCompanySizes$ = this.store.select(fromCommunityPostReducer.getCommunityCompanySizes);
  }

  ngOnInit() {

    const urlParams = Observable.combineLatest(
      this.route.params,
      this.route.url,
      (params, url) => ({ ...params, url: url.join('') })
    );
    urlParams.subscribe(routeParams => {
      if (routeParams.url.indexOf('post') > -1) {
        const postId = routeParams[ 'id' ];
        this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityPostToFilterOptions(postId));
      } else if (routeParams.url.indexOf('reply') > -1) {
        const replyId = routeParams[ 'id' ];
        this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityPostReplyToFilterOptions(replyId));
      } else if (routeParams.url.indexOf('tag') > -1) {
        const tag: Tag = {
          Id: null,
          TagName: '#' + routeParams[ 'id' ]
        };
        this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(tag));
      } else {
        this.getPosts();
      }
    });

    this.communityPostsSubscription = this.communityPosts$.subscribe(posts => {
      if (posts != null) {
        this.communityPosts = posts;
      }
    });

    this.loadingNextBatchCommunityPostsSubscription = this.loadingNextBatchCommunityPosts$.subscribe(value => {
      if (value != null) {
        this.loadingNextBatchCommunityPosts = value;
      }
    });

    this.loadingPreviousBatchCommunityPostsSubscription = this.loadingPreviousBatchCommunityPosts$.subscribe(value => {
      if (value != null) {
        this.loadingPreviousBatchCommunityPosts = value;
      }
    });

    this.hasNextBatchResultsOnServerSubscription = this.getHasNextBatchPostsOnServer$.subscribe(value => {
      if (value != null) {
        this.hasNextBatchOnServer = value;
      }
    });

    this.hasPreviousBatchResultsOnServerSubscription = this.getHasPreviousBatchPostsOnServer$.subscribe(value => {
      if (value != null) {
        this.hasPreviousBatchOnServer = value;
      }
    });

    this.store.dispatch(new fromCommunityIndustryActions.LoadingCommunityIndustries());
    this.store.dispatch(new fromCommunityCompanySizeActions.LoadingCommunityCompanySizes());

    // TODO: Industry filter test. Will be removed when filter's UI is available
    // this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityIndustryToFilterOptions('Retailing'));
    // this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityIndustryToFilterOptions('Insurance'));

    // TODO: Company sizes filter test. Will be removed when filter's UI is available
    // const companySize1: CommunityCompanySizeBucket = {LowRange : 1000, HighRange : 3000, DisplayName: '1,000 - 3,000'};
    // const companySize2: CommunityCompanySizeBucket = {LowRange : 50, HighRange : 100, DisplayName: '50 - 100'};
    // this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCompanySizeToFilterOptions(companySize1));
    // this.store.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityCompanySizeToFilterOptions(companySize2));
  }

  ngOnDestroy() {
    if (this.communityPostsSubscription) {
      this.communityPostsSubscription.unsubscribe();
    }

    if (this.loadingNextBatchCommunityPostsSubscription) {
      this.loadingNextBatchCommunityPostsSubscription.unsubscribe();
    }

    if (this.loadingPreviousBatchCommunityPostsSubscription) {
      this.loadingPreviousBatchCommunityPostsSubscription.unsubscribe();
    }

    if (this.hasNextBatchResultsOnServerSubscription) {
      this.hasNextBatchResultsOnServerSubscription.unsubscribe();
    }

    if (this.hasPreviousBatchResultsOnServerSubscription) {
      this.hasPreviousBatchResultsOnServerSubscription.unsubscribe();
    }
  }

  onScrollUp() {
    if (!this.loadingPreviousBatchCommunityPosts && this.hasPreviousBatchOnServer) {
      this.store.dispatch(new fromCommunityPostActions.GettingPreviousBatchCommunityPosts());
    }
  }

  onScrollDown() {
    if (!this.loadingNextBatchCommunityPosts && this.hasNextBatchOnServer) {
      this.store.dispatch(new fromCommunityPostActions.GettingNextBatchCommunityPosts());
    }
  }

  getPosts() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());
  }

  trackByPostId(index, item: CommunityPost) {
    return item.Id;
  }

  filtersModified() {
    this.filtersModifiedEvent.emit();
  }

  hashtagClicked(tagName: string) {
    const communityTag: CommunityTag = {
      Id: null,
      Tag: tagName,
      PostIds: null,
      ReplyIds: null,
      IsSuggested: null
    };

    const tag = mapCommunityTagToTag(communityTag);
    this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.AddingCommunityTagToFilterOptions(tag));
    this.filtersModified();
  }

}
