import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-like',
  templateUrl: './community-like.component.html',
  styleUrls: ['./community-like.component.scss']
})
export class CommunityLikeComponent {

  @Input() LikedByCurrentUser: boolean;
  @Input() PostId: string;
  @Input() ReplyId: string;
  @Input() LikeCount: number;

  constructor(public store: Store<fromCommunityPostReducer.State>) { }

  updateLike() {
    if (this.ReplyId) {
      this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostReplyLike(
      {postId: this.PostId, replyId: this.ReplyId, like: ! this.LikedByCurrentUser}));
    } else {
      this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostLike(
      {postId: this.PostId, like: !this.LikedByCurrentUser}));
    }
  }
}
