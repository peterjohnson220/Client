import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { CommunityReply } from 'libs/models/community';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReplyReducer from '../../reducers';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss'],
})

export class CommunityPostRepliesComponent implements OnInit, OnDestroy {
  @Input() replies: CommunityReply[];
  @Input() loading: boolean;
  @Input() disableCommunityAttachments: boolean;
  @Output() replyHashTagClicked = new EventEmitter();

  communityReplyEdited$: Observable<any>;
  replyEditedSubscription: Subscription;
  editedReplyId: string;

  constructor( public replyStore: Store<fromCommunityPostReplyReducer.State>) {
    this.communityReplyEdited$ = this.replyStore.select(fromCommunityPostReplyReducer.getCommunityReplyEdited);
  }

  ngOnInit() {
    this.replyEditedSubscription = this.communityReplyEdited$.subscribe( replyId => {
      this.editedReplyId = replyId;
    });
  }

  ngOnDestroy() {
    this.replyEditedSubscription.unsubscribe();
  }

  handleReplyHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }
}
