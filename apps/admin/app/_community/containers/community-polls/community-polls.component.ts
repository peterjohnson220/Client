import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { saveAs } from '@progress/kendo-file-saver';
import { GridComponent } from '@progress/kendo-angular-grid';

import * as constants from 'libs/models/community/community-constants.model';
import { CommunityPollList } from 'libs/models/community/community-poll-list.model';
import { AppConstants } from 'libs/constants';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})
export class CommunityPollsComponent implements OnInit, OnDestroy {

  communityPollListLoading$: Observable<boolean>;
  communityPollListLoadingError$: Observable<boolean>;
  communityPollListItems$: Observable<CommunityPollList[]>;
  exportingCommunityPollSuccess$: Observable<any>;
  exportingCommunityPollSuccessSubscription: Subscription;

  @ViewChild(GridComponent, { static: true }) grid: GridComponent;

  get CommunityPollStatuses() { return constants.CommunityPollStatuses; }

  get SiteAdminUrl() { return AppConstants.SiteAdminUrl; }

  constructor(private store: Store<fromCommunityPollReducer.State>) {
      this.communityPollListLoading$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoading);
      this.communityPollListLoadingError$ = this.store.select(fromCommunityPollReducer.getCommunityPollListLoadingError);
      this.communityPollListItems$ = this.store.select(fromCommunityPollReducer.getCommunityPollListItems);
      this.exportingCommunityPollSuccess$ = this.store.select(fromCommunityPollReducer.getExportingCommunityPollSuccess);
    }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());

    this.exportingCommunityPollSuccessSubscription = this.exportingCommunityPollSuccess$.subscribe(response => {
      if (response != null) {
        const url = window.URL.createObjectURL(response.body);
        saveAs(url, 'CommunityPoll.xlsx' );
      }
    });
  }

  ngOnDestroy() {
    this.exportingCommunityPollSuccessSubscription.unsubscribe();
  }

  public openCommunityPollModal() {
    this.store.dispatch(new fromCommunityPollActions.OpenCommunityPollModal());
  }

  public exportCommunityPoll(communityPoll: CommunityPollList):  void {
      this.store.dispatch(new fromCommunityPollActions.ExportingCommunityPoll(communityPoll.CommunityPollId));
    }

  public onCellClick( dataItem ) {
    this.store.dispatch(new fromCommunityPollActions.OpenCommunityPollModal(dataItem));
  }
}
