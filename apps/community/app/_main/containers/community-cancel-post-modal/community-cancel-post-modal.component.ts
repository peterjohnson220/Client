import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-cancel-post-modal',
  templateUrl: './community-cancel-post-modal.component.html',
  styleUrls: ['./community-cancel-post-modal.component.scss']
})
export class CommunityCancelPostModalComponent {

  @Input() title: string;

  cancelingPost$: Observable<boolean>;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.cancelingPost$ = this.store.select(fromCommunityReducers.getDiscardingPost);
  }

  handleModalSubmit() {
    this.store.dispatch(new fromCommunityPostActions.DiscardingCommunityPostProceed());
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCommunityPostActions.DiscardingCommunityPostCancel());
  }
}
