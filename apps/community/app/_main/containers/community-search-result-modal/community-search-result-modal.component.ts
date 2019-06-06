import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunitySearchPostReducer from '../../reducers';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityPost } from 'libs/models';

@Component({
  selector: 'pf-community-search-result-modal',
  templateUrl: './community-search-result-modal.component.html',
  styleUrls: ['./community-search-result-modal.component.scss']
})

export class CommunitySearchResultModalComponent implements OnInit, OnDestroy {
  communitySearchResultModal$: Observable<any>;
  communitySearchResultModalSubscription: Subscription;

  communityPost$: Observable<any>;
  communityPostSubscription: Subscription;

  maximumReplies$: Observable<number>;

  loadingCommunityPost$: Observable<boolean>;
  loadingCommunityPostError$: Observable<boolean>;

  communityPostDeleted$: Observable<any>;

  communityPost: CommunityPost;
  isUserPoll: boolean;

  constructor(public store: Store<fromCommunitySearchPostReducer.State>,
              private router: Router) {
    this.communitySearchResultModal$ = this.store.select(fromCommunitySearchPostReducer.getCommunitySearchResultModal);

    this.communityPost$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostCombinedWithReplies);
    this.loadingCommunityPost$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPost);
    this.loadingCommunityPostError$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPostError);

    this.maximumReplies$ = this.store.select(fromCommunitySearchPostReducer.getMaximumReplies);

    this.communityPostDeleted$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostDeleted);
   }

  ngOnInit() {
    this.communitySearchResultModalSubscription = this.communitySearchResultModal$.subscribe(postId => {
      if (postId != null) {
        this.store.dispatch(new fromCommunityPostActions.GettingCommunityPost(postId));
        }
    });

    this.communityPostSubscription = this.communityPost$.subscribe(post => {
      this.communityPost = post;
      if (post) {
        this.isUserPoll = post.UserPollRequest ? true : false;
      }
    });
  }

  ngOnDestroy() {
    if (this.communitySearchResultModalSubscription) {
      this.communitySearchResultModalSubscription.unsubscribe();
    }

    if (this.communityPostSubscription) {
      this.communityPostSubscription.unsubscribe();
    }
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromCommunitySearchActions.CloseSearchResultModal);
    this.communityPost = null;
  }

  hashtagClicked(hashTagName: string) {
    this.handleModalDismissed();

    if (hashTagName && hashTagName.substr(0, 1) === '#') {

      const hashTagText = hashTagName.substr(1);
      this.router.navigate([ `/dashboard/tag/${hashTagText}` ]);
    }
  }

  getTitle() {
    return this.isUserPoll ? 'Community Poll' : 'Community Discussion';
  }

  getDeletedMessage() {
    return this.isUserPoll ? 'Poll successfully deleted.' : 'Post successfully deleted.';
  }
}
