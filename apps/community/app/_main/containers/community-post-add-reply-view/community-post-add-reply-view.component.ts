import { Component, Input, OnInit, OnDestroy } from '@angular/core';

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
  addedReplyView$: Observable<CommunityReply[]>;
  filteredAddedReplies: CommunityReply[];
  addedRepliesSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>) {
    this.addedReplyView$ = this.addReplyViewStore.select(fromCommunityPostReplyReducer.getFilteredCommunityPostAddReplyView);
  }
  ngOnInit() {

    this.addedRepliesSubscription = this.addedReplyView$.subscribe(results => {
      this.filteredAddedReplies = results.filter(x => x.PostId === this.postId);
    });
  }
  ngOnDestroy() {
    this.addedRepliesSubscription.unsubscribe();
  }
}
