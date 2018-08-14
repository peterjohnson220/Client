import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';

import * as fromCommunityPollRequestReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

@Component({
  selector: 'pf-community-polls',
  templateUrl: './community-polls.component.html',
  styleUrls: ['./community-polls.component.scss']
})

export class CommunityPollsComponent implements OnInit, OnDestroy {
  selectedOption: number;
  communityPollRequests$: Observable<CommunityPollRequest[]>;
  communityPollRequestsLoading$: Observable<boolean>;
  communityPollRequestResponses$: Observable<CommunityPollResponse>;
  communityPollRequestResponsesSubscription: Subscription;
  communityPollResponseSubmitting$: Observable<boolean>;
  communityPollResponseSubmittingError$: Observable<boolean>;

  communityPollResponses$: Observable<boolean>;
  communityPollResponsesSuccess$: Observable<CommunityPollResponse[]>;
  communityPollResponsesError$: Observable<boolean>;
  communityPollResponsesSuccessSubscription: Subscription;
  userSubmittedResponses: CommunityPollResponse[] = [];

  constructor(public store: Store<fromCommunityPollRequestReducer.State>) {
    this.communityPollRequests$ = this.store.select(fromCommunityPollRequestReducer.getCommunityPollRequests);
    this.communityPollRequestsLoading$ = this.store.select(fromCommunityPollRequestReducer.getGettingCommunityPollRequests);
    this.communityPollRequestResponses$ = this.store.select(fromCommunityPollRequestReducer.getSubmittingCommunityPollRequestResponses);
    this.communityPollResponseSubmitting$ = this.store.select(fromCommunityPollRequestReducer.getSubmittingCommunityPollRequestResponse);

    this.communityPollResponses$ = this.store.select(fromCommunityPollRequestReducer.getGettingCommunityPollResponses);
    this.communityPollResponsesSuccess$ = this.store.select(fromCommunityPollRequestReducer.getGettingCommunityPollResponsesSuccess);
    this.communityPollResponsesError$ = this.store.select(fromCommunityPollRequestReducer.getGettingCommunityPollResponsesError);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollResponses());

    this.communityPollResponsesSuccessSubscription = this.communityPollResponsesSuccess$.subscribe(responses => {
      if (responses != null) {
        this.userSubmittedResponses = responses;
      }
    });

    this.communityPollRequestResponsesSubscription = this.communityPollRequestResponses$.subscribe(responses => {
      if (responses != null) {
        this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollResponses());
      }
      this.selectedOption = null;
    });
  }

  ngOnDestroy() {
    this.communityPollRequestResponsesSubscription.unsubscribe();
    this.communityPollResponsesSuccessSubscription.unsubscribe();
  }

  selectOption(selected: number) {
    this.selectedOption = selected;
  }
  submitPollResponse(communityPollId: string, selectedResponseId: string) {
    this.store.dispatch(new fromCommunityPollRequestActions.SubmittingCommunityPollRequest(
      { communityPollId: communityPollId, selectedResponseId: selectedResponseId} ));
  }
  onCarouselSlideChange(slideEvent: NgbSlideEvent): void {
    this.selectedOption = null;
  }

  includesCommunityPollId(communityPollId: string): boolean {
    return this.userSubmittedResponses.some(x => x.CommunityPollId === communityPollId);
  }

  getResponsePercentage(responseId: number, communityPollId: string): number {
    const communityPollUserResponses = this.userSubmittedResponses.find( x => x.CommunityPollId === communityPollId);
    if (communityPollUserResponses === null) {
      return 0;
    }
    return communityPollUserResponses.ResponsePercents[responseId];
  }
}
