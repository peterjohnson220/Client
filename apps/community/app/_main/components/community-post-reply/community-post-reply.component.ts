import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CommunityReply, CommunityPost } from 'libs/models/community';
import { environment } from 'environments/environment';

import * as fromCommunityReducers from '../../reducers';

@Component({
  selector: 'pf-community-post-reply',
  templateUrl: './community-post-reply.component.html',
  styleUrls: ['./community-post-reply.component.scss'],
})
export class CommunityPostReplyComponent implements OnInit {
  @Input() reply: CommunityReply;
  @Input() post: CommunityPost;
  @Input() maximumReplies: number;
  @Input() disableCommunityAttachments: boolean;
  @Input() hideAttachmentWarning: boolean;
  @Output() replyHashTagClicked = new EventEmitter();
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  avatarUrl = environment.avatarSource;
  showAddReply = false;
  discardingPostId: string;

  discardingPostId$: Observable<string>;
  discardingPostReplyProceed$: Observable<boolean>;

  discardingPostIdSubscription: Subscription;
  discardingPostReplyProceedSubscription: Subscription;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.discardingPostId$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyId);
    this.discardingPostReplyProceed$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyProceed);
  }

  ngOnInit(): void {
    this.discardingPostIdSubscription = this.discardingPostId$.subscribe(result => {
      if (result) {
        this.discardingPostId = result;
      }
    });

    this.discardingPostReplyProceedSubscription = this.discardingPostReplyProceed$.subscribe(result => {
      if (result && this.discardingPostId === this.reply.Id) {
        this.showAddReply = false;
      }
    });
  }

  handleHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }

  handleAttachmentClickedEvent(event) {
    this.onAttachmentClickedEvent.emit(event);
  }

  showReply() {
    this.showAddReply = !this.showAddReply;
  }

  onReplySubmitted() {
    this.showReply();
  }
}
