import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import * as fromCommunityPostAddReplyViewReducer from '../../reducers';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

import { CommunityPost } from 'libs/models/community';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.scss']
})
export class CommunityPostsComponent implements OnInit {

  avatarUrl = environment.avatarSource;
  communityPosts$: Observable<CommunityPost[]>;
  loadingCommunityPosts$: Observable<boolean>;
  loadingCommunityPostReplies$: Observable<boolean>;
  showAddReply = {};
  showReplies = [];

  constructor(public store: Store<fromCommunityPostReducer.State>,
              public replyStore: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {

    this.communityPosts$ = this.store.select(fromCommunityPostReducer.getCommunityPostsCombinedWithReplies);
    this.loadingCommunityPosts$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPosts);
    this.loadingCommunityPostReplies$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPostReplies);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());
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

  clearRepliesFromAddView(postId: number){
    this.addReplyViewStore.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies({ PostId: postId }));
  }

  getCommunityPostReplies(postId: number){
    this.replyStore.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }
  trackByPostId(index, item: CommunityPost) {
    return item.Id;
  }

}
