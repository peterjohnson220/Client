import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
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

  constructor(public store: Store<fromCommunityPostReducer.State>) {
    this.communityPosts$ = this.store.select(fromCommunityPostReducer.getCommunityPosts);
    this.loadingCommunityPosts$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPosts);
    this.loadingCommunityPostReplies$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPostReplies);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());
  }

  getReplies(item: number, postId: number) {
    this.showReplies[item] = !this.showReplies[item];
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPostReplies( { PostId: postId }));
  }

  hideReplies(item: number) {
    this.showReplies[item] = !this.showReplies[item];
  }

  updatePostLike(post: any) {
    this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostLike({postId: post.Id, like: !post.LikedByCurrentUser}));
  }
}
