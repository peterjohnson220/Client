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

  constructor(public store: Store<fromCommunityPostReducer.State>) {
    this.communityPosts$ = this.store.select(fromCommunityPostReducer.getCommunityPosts);
    this.loadingCommunityPosts$ = this.store.select(fromCommunityPostReducer.getGettingCommunityPosts);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPostActions.GettingCommunityPosts());
  }

  updatePostLike(post: any) {
    this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostLike({postId: post.Id, like: !post.LikedByCurrentUser}));
  }
}
