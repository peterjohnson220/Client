import { Component, OnInit, OnDestroy } from '@angular/core';
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

  communityPost: CommunityPost;

  constructor(public store: Store<fromCommunitySearchPostReducer.State>) {
    this.communitySearchResultModal$ = this.store.select(fromCommunitySearchPostReducer.getCommunitySearchResultModal);

    this.communityPost$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostCombinedWithReplies);
    this.loadingCommunityPost$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPost);
    this.loadingCommunityPostError$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPostError);

    this.maximumReplies$ = this.store.select(fromCommunitySearchPostReducer.getMaximumReplies);
   }

  ngOnInit() {
    this.communitySearchResultModalSubscription = this.communitySearchResultModal$.subscribe(postId => {
      if (postId != null) {
        this.store.dispatch(new fromCommunityPostActions.GettingCommunityPost(postId));
        }
    });

    this.communityPostSubscription = this.communityPost$.subscribe(post => {
      this.communityPost = post;
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
}
