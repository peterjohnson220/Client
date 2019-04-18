import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunitySearchPostReducer from '../../reducers';

import { CommunityPost } from 'libs/models';
import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-search-result-modal',
  templateUrl: './community-search-result-modal.component.html',
  styleUrls: ['./community-search-result-modal.component.scss']
})

export class CommunitySearchResultModalComponent implements OnInit, OnDestroy {
  communitySearchResultModal$: Observable<any>;
  communitySearchResultModalSubscription: Subscription;

  communityPost$: Observable<CommunityPost>;
  maximumReplies$: Observable<number>;

  loadingCommunityPost$: Observable<boolean>;
  loadingCommunityPostError$: Observable<boolean>;

  constructor(public store: Store<fromCommunitySearchPostReducer.State>) {
    this.communitySearchResultModal$ = this.store.select(fromCommunitySearchPostReducer.getCommunitySearchResultModal);
    this.communityPost$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPost);
    this.maximumReplies$ = this.store.select(fromCommunitySearchPostReducer.getMaximumReplies);
    this.loadingCommunityPost$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPost);
    this.loadingCommunityPostError$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPostError);
  }

  ngOnInit() {
    this.communitySearchResultModalSubscription = this.communitySearchResultModal$.subscribe(result => {
      if (result != null) {
        this.store.dispatch(new fromCommunityPostActions.GettingCommunityPost(result));
      }
    });
  }

  ngOnDestroy() {
    if (this.communitySearchResultModalSubscription) {
      this.communitySearchResultModalSubscription.unsubscribe();
    }
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromCommunitySearchActions.CloseSearchResultModal);
  }
}
