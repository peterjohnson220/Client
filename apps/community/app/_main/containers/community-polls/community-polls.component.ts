import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';

import * as fromCommunityPollRequestReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})

export class CommunityPollsComponent implements OnInit, OnDestroy {
  selectedOption: number;
  communityPollRequests$: Observable<CommunityPollRequest[]>;
  communityPollRequestsLoading$: Observable<boolean>;
  communityPollRequestResponses$: Observable<number[]>;
  communityPollRequestResponsesSubscription: Subscription;
  userSubmittedResponses: number[];

  constructor(public store: Store<fromCommunityPollRequestReducer.State>) {
    this.communityPollRequests$ = this.store.select(fromCommunityPollRequestReducer.getCommunityPollRequests);
    this.communityPollRequestsLoading$ = this.store.select(fromCommunityPollRequestReducer.getGettingCommunityPollRequests);
    this.communityPollRequestResponses$ = this.store.select(fromCommunityPollRequestReducer.getSubmittingCommunityPollRequestResponses);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
    this.communityPollRequestResponsesSubscription = this.communityPollRequestResponses$.subscribe(responses => {
      this.userSubmittedResponses = responses;
      this.selectedOption = null;
    });
  }

  ngOnDestroy() {
    this.communityPollRequestResponsesSubscription.unsubscribe();
  }

  selectOption(selected: number) {
    this.selectedOption = selected;
  }
  submitPollResponse(communityPollId: number, selectedResponseId: number) {
    this.store.dispatch(new fromCommunityPollRequestActions.SubmittingCommunityPollRequest(
      { communityPollId: communityPollId, selectedResponseId: selectedResponseId} ));
  }
  onCarouselSlideChange(slideEvent: NgbSlideEvent): void {
    this.selectedOption = null;
  }
}
