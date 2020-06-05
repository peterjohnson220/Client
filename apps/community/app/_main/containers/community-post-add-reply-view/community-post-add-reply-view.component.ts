import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostAddReplyViewReducer from '../../reducers';

import { CommunityReply } from 'libs/models/community';

@Component({
  selector: 'pf-community-post-add-reply-view',
  templateUrl: './community-post-add-reply-view.component.html',
  styleUrls: ['./community-post-add-reply-view.component.scss'],
})
export class CommunityPostAddReplyViewComponent implements  OnInit, OnDestroy {
  @Input() postId: string;
  @Input() disableCommunityAttachments: boolean;
  @Output() replyHashTagClicked = new EventEmitter();
  addedReplyView$: Observable<CommunityReply[]>;
  communityReplyEdited$: Observable<any>;
  filteredAddedReplies: CommunityReply[];
  addedRepliesSubscription: Subscription;
  editedReplyId: string;
  replyEditedSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {
    this.addedReplyView$ = this.addReplyViewStore.select(fromCommunityPostReplyReducer.getFilteredCommunityPostAddReplyView);
    this.communityReplyEdited$ = this.addReplyViewStore.select(fromCommunityPostReplyReducer.getCommunityReplyEdited);
  }
  ngOnInit() {

    this.addedRepliesSubscription = this.addedReplyView$.subscribe(results => {
      this.filteredAddedReplies = results.filter(x => x.PostId === this.postId);
    });

    this.replyEditedSubscription = this.communityReplyEdited$.subscribe( replyId => {
      this.editedReplyId = replyId;
    });
  }
  ngOnDestroy() {
    this.addedRepliesSubscription.unsubscribe();
    this.replyEditedSubscription.unsubscribe();
  }

  handleHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }
}
