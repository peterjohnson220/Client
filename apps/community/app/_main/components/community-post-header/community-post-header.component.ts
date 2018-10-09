import { Component, Input } from '@angular/core';

import { CommunityUserInfo } from 'libs/models/community/community-user-info.model';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import { Store } from '@ngrx/store';

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

  constructor(public store: Store<fromCommunityPostReducer.State>) {
  }

  Delete() {
    if (this.isReply) {
      this.DeleteReply();
    } else {
      this.DeletePost();
    }
  }

  DeletePost() {
    this.store.dispatch(new fromCommunityPostActions.DeletingCommunityPost(
      {
        postId: this.postId
      }));
  }

  DeleteReply() {
    this.store.dispatch(new fromCommunityPostReplyActions.DeletingCommunityPostReply(
      { postId: this.postId, replyId: this.replyId}));
  }
}
