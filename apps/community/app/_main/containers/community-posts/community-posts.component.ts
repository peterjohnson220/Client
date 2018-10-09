import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import * as fromCommunityPostAddReplyViewReducer from '../../reducers';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

import { CommunityPost, CommunityPollResponse } from 'libs/models/community';
import { environment } from 'environments/environment';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss']
})
export class CommunityPostsComponent implements OnInit, OnDestroy {

  avatarUrl = environment.avatarSource;
  communityPosts$: Observable<CommunityPost[]>;
  communityPollResponseSubmitted$: Observable<CommunityPollResponse>;

  showAddReply = {};
  showReplies = [];

  userSubmittedResponses: CommunityPollResponse[];
  communityPosts: CommunityPost[];
  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  communityPostsSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReducer.State>,
              public replyStore: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {

    this.communityPosts$ = this.store.select(fromCommunityPostReducer.getCommunityPostsCombinedWithReplies);
    this.communityPollResponseSubmitted$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponses);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());

    this.communityPostsSubscription = this.communityPosts$.subscribe(posts => {
      if (posts != null) {this.communityPosts = posts; }
    });
  }

  ngOnDestroy() {
    if ( this.communityPostsSubscription) {
      this.communityPostsSubscription.unsubscribe();
    }
  }

  getReplies(item: number, postId: number) {
    this.showReplies[item] = !this.showReplies[item];
    this.getCommunityPostReplies(postId);
  }

  hideReplies(item: number, postId: number) {
    this.showReplies[item] = !this.showReplies[item];
    this.clearRepliesFromAddView(postId);
    this.getCommunityPostReplies(postId);
  }

  clearRepliesFromAddView(postId: number) {
    this.addReplyViewStore.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies({ PostId: postId }));
  }

  getCommunityPostReplies(postId: number) {
    this.replyStore.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }

  trackByPostId(index, item: CommunityPost) {
    return item.Id;
  }

  showReply(item: number) {
    this.showAddReply[item] = !this.showAddReply[item];
  }

  onReplySubmitted(item: number) {
    this.showReply(item);
  }
}
