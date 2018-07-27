import { Component, OnInit } from '@angular/core';
import { CommunityPoll } from 'libs/models/community/community-poll.model';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';
import { CommunityPollStatusEnum } from 'libs/models/community/community-poll-status.enum';
import { CommunityPollUpdateStatusRequest } from 'libs/models/community/community-poll-update-status-request.model';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})
export class CommunityPollsComponent implements OnInit {

  communityPollListLoading$: Observable<boolean>;
  communityPollListLoadingError$: Observable<boolean>;
  communityPollListItems$: Observable<CommunityPoll[]>;
  addingCommunityPollSuccess$: Observable<boolean>;

  CommunityPollStatuses: Array<{ text: string, value: CommunityPollStatusEnum }> = [
    { text: 'Draft', value: CommunityPollStatusEnum.Draft },
    { text: 'Live', value: CommunityPollStatusEnum.Live },
    { text: 'Archived', value: CommunityPollStatusEnum.Archived }
  ];

  constructor(private store: Store<fromCommunityPollReducer.State>) {
    this.communityPollListLoading$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoading);
    this.communityPollListLoadingError$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoadingError);
    this.communityPollListItems$ = this.store.select(fromCommunityPollReducer.getCommunityPollListItems);
    this.addingCommunityPollSuccess$ = this.store.select(fromCommunityPollReducer.getAddingCommunityPollSuccess);
   }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());

    this.addingCommunityPollSuccess$.subscribe(success => {
      if (success) {
        this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());
      }
    });
  }

  openCommunityPollModal() {
    this.store.dispatch(new fromCommunityPollActions.OpenAddCommunityPollModal);
  }

  public selectionChange(status: any, communityPollId: string): void {

    const pollStatusRequest: CommunityPollUpdateStatusRequest = {
      CommunityPollId: communityPollId,
      Status: status.value
    };
    this.store.dispatch(new fromCommunityPollActions.UpdatingCommunityPollStatus(pollStatusRequest));
  }

}
