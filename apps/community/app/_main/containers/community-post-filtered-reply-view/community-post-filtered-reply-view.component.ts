import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommunityReply } from 'libs/models/community';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReplyReducer from '../../reducers';

@Component({
  selector: 'pf-community-post-filtered-reply-view',
  templateUrl: './community-post-filtered-reply-view.component.html',
  styleUrls: ['./community-post-filtered-reply-view.component.scss']
})
export class CommunityPostFilteredReplyViewComponent implements OnInit, OnDestroy {

  @Input() postId: string;
  filteredReplyView$: Observable<CommunityReply[]>;
  filteredReplies: CommunityReply[];
  filteredRepliesSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReplyReducer.State>) {
    this.filteredReplyView$ = this.store.select(fromCommunityPostReplyReducer.getFilteredCommunityPostReplyView);
  }
  ngOnInit() {

    this.filteredRepliesSubscription = this.filteredReplyView$.subscribe(results => {
      this.filteredReplies = results.filter(x => x.PostId === this.postId);
    });
  }
  ngOnDestroy() {
    this.filteredRepliesSubscription.unsubscribe();
  }
}
