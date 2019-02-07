import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityUserInfo } from 'libs/models/community/community-user-info.model';
import { CommunityDeletePost } from '../../models/community-delete-post.model';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

@Component({
  selector: 'pf-community-post-header',
  templateUrl: './community-post-header.component.html',
  styleUrls: [ './community-post-header.component.scss' ]
})
export class CommunityPostHeaderComponent {
  @Input() user: CommunityUserInfo;
  @Input() time: any;
  @Input() isInternalOnly: boolean;
  @Input() isCurrentUserPost: boolean;
  @Input() postId: string;
  @Input() replyId: string;
  @Input() isReply = false;
  @Input() isExpiredPoll = false;
  @Input() isUserPoll = false;
  @Input() userPollId: string;

  constructor(public store: Store<fromCommunityPostReducer.State>) {
  }

  delete() {
    if (this.isReply) {
      this.deleteReply();
    } else {
      this.deletePost();
    }
  }

  deletePost() {
    const post: CommunityDeletePost = { PostId: this.postId, IsInternalOnly: this.isInternalOnly };
    this.store.dispatch(new fromCommunityPostActions.DeletingCommunityPost(post));
  }

  deleteReply() {
    this.store.dispatch(new fromCommunityPostReplyActions.DeletingCommunityPostReply(
      { postId: this.postId, replyId: this.replyId}));
  }

  exportPollResults() {
    this.store.dispatch(new fromCommunityPollResponseActions.ExportingCommunityUserPollResponses(this.userPollId));
  }
}
