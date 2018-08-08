import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityPollList } from 'libs/models/community/community-poll-list.model';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';
import { CommunityPollUpdateStatusRequest } from 'libs/models/community/community-poll-update-status-request.model';
import { saveAs } from '@progress/kendo-file-saver';


@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})
export class CommunityPollsComponent implements OnInit, OnDestroy {

  communityPollListLoading$: Observable<boolean>;
  communityPollListLoadingError$: Observable<boolean>;
  communityPollListItems$: Observable<CommunityPollList[]>;
  addingCommunityPollSuccess$: Observable<boolean>;
  exportingCommunityPollSuccess$: Observable<any>;
  addingCommunityPollSuccessSubscription: Subscription;
  exportingCommunityPollSuccessSubscription: Subscription;

  CommunityPollStatuses: Array<{ text: string, value: number }> = [
    { text: 'Draft', value: 0 },
    { text: 'Live', value: 1 },
    { text: 'Archived', value: 2 }
  ];

  constructor(private store: Store<fromCommunityPollReducer.State>) {
    this.communityPollListLoading$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoading);
    this.communityPollListLoadingError$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoadingError);
    this.communityPollListItems$ = this.store.select(fromCommunityPollReducer.getCommunityPollListItems);
    this.addingCommunityPollSuccess$ = this.store.select(fromCommunityPollReducer.getAddingCommunityPollSuccess);
    this.exportingCommunityPollSuccess$ = this.store.select(fromCommunityPollReducer.getExportingCommunityPollSuccess);
    }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());

    this.addingCommunityPollSuccessSubscription = this.addingCommunityPollSuccess$.subscribe(success => {
      if (success) {
        this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());
      }
    });

    this.exportingCommunityPollSuccessSubscription = this.exportingCommunityPollSuccess$.subscribe(response => {
      if (response != null) {
        const url = window.URL.createObjectURL(response.body);
        saveAs(url, 'CommunityPoll.xlsx' );
      }
    });
  }

  ngOnDestroy() {
    this.addingCommunityPollSuccessSubscription.unsubscribe();
    this.exportingCommunityPollSuccessSubscription.unsubscribe();
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

  public exportCommunityPoll(communityPoll: CommunityPollList):  void {
      this.store.dispatch(new fromCommunityPollActions.ExportingCommunityPoll(communityPoll.CommunityPollId));
    }
}
