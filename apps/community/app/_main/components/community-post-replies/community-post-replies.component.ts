import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityReply } from 'libs/models/community';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss'],
})
export class CommunityPostRepliesComponent {
  @Input() replies: CommunityReply[];
  @Input() loading: boolean;
  avatarUrl = environment.avatarSource;
  constructor(public store: Store<fromCommunityPostReducer.State>) {}

  updateReplyLike(reply: any) {
    this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostReplyLike(
      {postId: reply.PostId, replyId: reply.Id, like: !reply.LikedByCurrentUser}));
  }
}
