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

  @Output() filtersModifiedEvent = new EventEmitter<string>();

  showAddReply = {};
  showReplies = [];

  constructor( public replyStore: Store<fromCommunityPostReplyReducer.State>,
    public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {
  }

  ngOnInit() {
  }

  hashtagClicked(tagName: string) {
    this.filtersModifiedEvent.emit(tagName);
  }

  showReply(item: number) {
    this.showAddReply[ item ] = !this.showAddReply[ item ];
  }

  onReplySubmitted(item: number) {
    this.showReply(item);
  }

  getReplies(item: number, postId: number) {
    this.showReplies[ item ] = !this.showReplies[ item ];
    this.getCommunityPostReplies(postId);
  }

  hideReplies(item: number, postId: number) {
    this.showReplies[ item ] = !this.showReplies[ item ];
    this.clearRepliesFromAddView(postId);
    this.getCommunityPostReplies(postId);
  }

  getCommunityPostReplies(postId: number) {
    this.replyStore.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }

  clearRepliesFromAddView(postId: number) {
    this.addReplyViewStore.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies());
  }

  hasReplies(post: CommunityPost) {
    return post.ReplyCount > 0 ? true : false;
  }


}
