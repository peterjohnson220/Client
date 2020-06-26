import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

@Component({
  selector: 'pf-community-cancel-post-reply-modal',
  templateUrl: './community-cancel-post-reply-modal.component.html',
  styleUrls: ['./community-cancel-post-reply-modal.component.scss']
})
export class CommunityCancelPostReplyModalComponent {

  @Input() title: string;

  cancelingPostReply$: Observable<boolean>;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.cancelingPostReply$ = this.store.select(fromCommunityReducers.getDiscardingPostReply);
  }

  handleModalSubmit() {
    this.store.dispatch(new fromCommunityPostReplyActions.DiscardingCommunityPostReplyProceed());
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCommunityPostReplyActions.DiscardingCommunityPostReplyCancel());
  }
}
