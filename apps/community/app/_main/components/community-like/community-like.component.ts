import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

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

  constructor(public store: Store<fromCommunityPostReducer.State>,
              public replyStore: Store<fromCommunityPostReplyReducer.State>) { }

  updateLike() {
    if (this.ReplyId) {
      this.replyStore.dispatch(new fromCommunityPostReplyActions.UpdatingCommunityPostReplyLike(
      {postId: this.PostId, replyId: this.ReplyId, like: ! this.LikedByCurrentUser}));
    } else {
      this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostLike(
      {postId: this.PostId, like: !this.LikedByCurrentUser}));
    }
  }
}
