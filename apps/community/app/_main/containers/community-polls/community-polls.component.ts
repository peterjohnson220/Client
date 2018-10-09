import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})

export class CommunityPollsComponent implements OnInit, OnDestroy {
  communityPollRequests$: Observable<CommunityPollRequest[]>;
  communityPollRequestsLoaded$: Observable<boolean>;
  communityPollResponses$: Observable<CommunityPollResponse[]>;

  communityPollResponsesSuccessSubscription: Subscription;
  communityPollRequestsSubscription: Subscription;

  userSubmittedResponses: CommunityPollResponse[];
  communityPollRequests: CommunityPollRequest[];

  constructor(public store: Store<fromCommunityPollReducer.State>) {
    this.communityPollRequests$ = this.store.select(fromCommunityPollReducer.getCommunityPollRequests);
    this.communityPollRequestsLoaded$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollRequestsLoaded);
    this.communityPollResponses$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollResponsesSuccess);
   }

  ngOnInit() {

    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
    this.store.dispatch(new fromCommunityPollResponseActions.LoadingCommunityPollResponses());

    this.communityPollRequestsSubscription = this.communityPollRequests$.subscribe(requests => {
      this.communityPollRequests = requests;
    });

    this.communityPollResponsesSuccessSubscription = this.communityPollResponses$.subscribe(responses => {
      if (responses) {
          this.userSubmittedResponses = responses.map(o => {
          return { CommunityPollId: o.CommunityPollId, ResponsePercents: o.ResponsePercents, IsDismissed: false };
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.communityPollResponsesSuccessSubscription) {
      this.communityPollResponsesSuccessSubscription.unsubscribe();
    }

    if (this.communityPollRequestsSubscription) {
      this.communityPollRequestsSubscription.unsubscribe();
    }
  }

  getPollResponse(communityPollId: string): CommunityPollResponse {
    return this.userSubmittedResponses.find(x => x.CommunityPollId === communityPollId);
  }
}
