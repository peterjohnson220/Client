import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/combineLatest';

import * as fromCommunityReducers from '../../reducers';

import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import * as fromCommunityAttachmentWarningActions from '../../actions/community-attachment-warning.actions';

import { CommunityPost, CommunityTopic } from 'libs/models/community';
import { environment } from 'environments/environment';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityTag } from 'libs/models/community/community-tag.model';
import { Tag } from '../../models/tag.model';
import { mapCommunityTagToTag } from '../../helpers/model-mapping.helper';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: [ './community-posts.component.scss' ]
})
export class CommunityPostsComponent implements OnInit, OnDestroy {
  @Input() disableCommunityAttachments: boolean;
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
  communityPostEdited$: Observable<any>;
  hideAttachmentWarning$: Observable<boolean>;
  communityTopics$: Observable<CommunityTopic[]>;
  hideAttachmentWarning: boolean;

  communityPosts: CommunityPost[];
  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  communityPostsSubscription: Subscription;
  loadingNextBatchCommunityPostsSubscription: Subscription;
  loadingPreviousBatchCommunityPostsSubscription: Subscription;
  hasNextBatchResultsOnServerSubscription: Subscription;
  hasPreviousBatchResultsOnServerSubscription: Subscription;
  postEditedSubscription: Subscription;
  hideAttachmentWarningSubscription: Subscription;

  loadingNextBatchCommunityPosts: boolean;
  loadingPreviousBatchCommunityPosts: boolean;
  hasNextBatchOnServer: boolean;
  hasPreviousBatchOnServer: boolean;
  editedPostId: string;


  constructor(private route: ActivatedRoute,
              public store: Store<fromCommunityReducers.State>,
              public replyStore: Store<fromCommunityReducers.State>,
              public addReplyViewStore: Store<fromCommunityReducers.State>,
              public filterStore: Store<fromCommunityReducers.State>,
              private settingService: SettingsService) {

    this.communityPosts$ = this.store.select(fromCommunityReducers.getCommunityPostsCombinedWithReplies);
    this.maximumReplies$ = this.store.select(fromCommunityReducers.getMaximumReplies);

    this.loadingCommunityPosts$ = this.store.select(fromCommunityReducers.getGettingCommunityPosts);
    this.loadingNextBatchCommunityPosts$ = this.store.select(fromCommunityReducers.getLoadingNextBatchPosts);
    this.loadingPreviousBatchCommunityPosts$ = this.store.select(fromCommunityReducers.getLoadingPreviousBatchPosts);
    this.totalDiscussionResultsOnServer$ = this.store.select(fromCommunityReducers.getTotalDiscussionResultsOnServer);
    this.getHasNextBatchPostsOnServer$ = this.store.select(fromCommunityReducers.getHasNextBatchPostsOnServer);
    this.getHasPreviousBatchPostsOnServer$ = this.store.select(fromCommunityReducers.getHasPreviousBatchPostsOnServer);
    this.filteredByPost$ = this.filterStore.select(fromCommunityReducers.getFilteredByPost);
    this.communityPostEdited$ = this.store.select(fromCommunityReducers.getCommunityPostEdited);
    this.hideAttachmentWarning$ = this.settingService.selectUiPersistenceSetting(
      FeatureAreaConstants.Community, UiPersistenceSettingConstants.CommunityHideAttachmentWarningModal, 'boolean');
    this.communityTopics$ = this.store.select(fromCommunityReducers.getTopics);
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
      } else if (routeParams.url.indexOf('topic') > -1) {
        this.communityTopics$.subscribe( topics => {
          if (topics) {
            const selectedTopic = topics.find(x => x.TopicName === routeParams[ 'id' ]);
            if (selectedTopic) {
              const topic: any = [{
                Id: selectedTopic.Id,
                TopicName: selectedTopic.TopicName
              }];
              this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.ChangingCommunityTopicFilterOptions(topic));
              return;
            }
           }
        });

       } else {
        this.getPosts();
      }
    });

    this.postEditedSubscription = this.communityPostEdited$.subscribe( postId => {
      this.editedPostId = postId;
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

    this.hideAttachmentWarningSubscription = this.hideAttachmentWarning$.subscribe(value => {
      if (value != null) {
        this.hideAttachmentWarning = value;
      }
    });
  }

  ngOnDestroy() {
    if (this.postEditedSubscription) {
      this.postEditedSubscription.unsubscribe();
    }

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

  handleAttachmentClickedEvent(event) {
    this.store.dispatch(new fromCommunityAttachmentWarningActions.OpenCommunityAttachmentsWarningModal(event));
  }
}
