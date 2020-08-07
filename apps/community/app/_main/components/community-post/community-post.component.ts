import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityPost } from 'libs/models';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pf-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss']
})
export class CommunityPostComponent implements OnInit, OnChanges, OnDestroy {
  @Input() post: CommunityPost;
  @Input() maximumReplies: number;
  @Input() isModal: boolean;
  @Input() hideAttachmentWarning: boolean;
  @Input() disableCommunityAttachments: boolean;

  @Output() filtersModifiedEvent = new EventEmitter<string>();
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  discardingPostId$: Observable<string>;
  discardingPostReplyProceed$: Observable<boolean>;
  loadingCommunityPostReplies$: Observable<boolean>;

  discardingPostIdSubscription: Subscription;
  discardingPostReplyProceedSubscription: Subscription;

  showAddReply = false;
  showReplies = false;
  replyCount: number;
  discardingPostId = null;

  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.discardingPostId$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyId);
    this.discardingPostReplyProceed$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyProceed);
    this.loadingCommunityPostReplies$ = this.store.select(fromCommunityReducers.getGettingCommunityPostReplies);
  }

  ngOnInit() {
    if ( this.isModal ) {
      this.getReplies(this.post.Id);
    }

    this.discardingPostIdSubscription = this.discardingPostId$.subscribe(result => {
      if (result) {
        this.discardingPostId = result;
      }
    });

   this.discardingPostReplyProceedSubscription = this.discardingPostReplyProceed$.subscribe(result => {
      if (result && this.discardingPostId === this.post.Id) {
        this.showAddReply = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.post.currentValue) {
      this.replyCount = changes.post.currentValue.ReplyCount;
    }
  }

  ngOnDestroy() {
    this.discardingPostIdSubscription.unsubscribe();
    this.discardingPostReplyProceedSubscription.unsubscribe();
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
    this.clearRepliesFromAddView();
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
