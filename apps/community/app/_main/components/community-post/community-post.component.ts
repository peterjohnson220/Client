import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityPost } from 'libs/models';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import * as fromCommunityPostAddReplyViewReducer from '../../reducers';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

@Component({
  selector: 'pf-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss']
})
export class CommunityPostComponent implements OnInit {
  @Input() post: CommunityPost;
  @Input() maximumReplies: number;
  @Input() isModal: boolean;

  @Output() filtersModifiedEvent = new EventEmitter<string>();

  showAddReply: boolean;
  showReplies: boolean;

  constructor( public replyStore: Store<fromCommunityPostReplyReducer.State>,
    public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {
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
    this.replyStore.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }

  clearRepliesFromAddView() {
    this.addReplyViewStore.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies());
  }

  hasReplies(post: CommunityPost) {
    return post.ReplyCount > 0 ? true : false;
  }

}
