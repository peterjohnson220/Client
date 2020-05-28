import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityPost } from 'libs/models';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss']
})
export class CommunityPostComponent implements OnInit {
  @Input() post: CommunityPost;
  @Input() maximumReplies: number;
  @Input() isModal: boolean;
  @Input() hideAttachmentWarning: boolean;

  @Output() filtersModifiedEvent = new EventEmitter<string>();
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  showAddReply: boolean;
  showReplies: boolean;

  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  constructor(public store: Store<fromCommunityReducers.State>) {
  }

  ngOnInit() {
    if ( this.isModal ) {
      this.getReplies(this.post.Id);
    }
  }

  hashtagClicked(tagName: string) {
    this.filtersModifiedEvent.emit(tagName);
  }

  showReply() {
    this.showAddReply = !this.showAddReply;
  }

  onReplySubmitted() {
    this.showReply();
  }

  getReplies(postId) {
    this.showReplies = !this.showReplies;
    this.getCommunityPostReplies(postId);
  }

  hideReplies(postId) {
    this.showReplies = !this.showReplies;
    this.clearRepliesFromAddView();
    this.getCommunityPostReplies(postId);
  }

  getCommunityPostReplies(postId) {
    this.store.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }

  clearRepliesFromAddView() {
    this.store.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies());
  }

  hasReplies(post: CommunityPost) {
    return post.ReplyCount > 0 ? true : false;
  }

  handleAttachmentClickedEvent(event) {
    this.onAttachmentClickedEvent.emit(event);
  }
}
