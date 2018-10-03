import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';

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
  communityPolResponseSubmitted$: Observable<CommunityPollResponse>;

  communityPollResponseSubmittedSubscription: Subscription;
  communityPollResponsesSuccessSubscription: Subscription;

  userSubmittedResponses: CommunityPollResponse[];
  selectedOption: number;
  dismissedPollIds: string[] = [];

  constructor(public store: Store<fromCommunityPollReducer.State>) {
    this.communityPollRequests$ = this.store.select(fromCommunityPollReducer.getCommunityPollRequests);
    this.communityPollRequestsLoaded$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollRequestsLoaded);
    this.communityPollResponses$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollResponsesSuccess);
    this.communityPolResponseSubmitted$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponses);
  }

  ngOnInit() {

    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
    this.store.dispatch(new fromCommunityPollResponseActions.LoadingCommunityPollResponses());

    this.communityPollResponsesSuccessSubscription = this.communityPollResponses$.subscribe(responses => {
      if (responses != null) {

        this.userSubmittedResponses = responses.map(o => {
          return { CommunityPollId: o.CommunityPollId, ResponsePercents: o.ResponsePercents, IsDismissed: false };
        });
      }

    });

    this.communityPollResponseSubmittedSubscription = this.communityPolResponseSubmitted$.subscribe(responses => {
      if (responses != null) {
        this.store.dispatch(new fromCommunityPollResponseActions.LoadingCommunityPollResponses());
      }
      this.selectedOption = null;
    });

  }

  ngOnDestroy() {
    if (this.communityPollResponseSubmittedSubscription) {
      this.communityPollResponseSubmittedSubscription.unsubscribe();
    }

    if (this.communityPollResponsesSuccessSubscription) {
      this.communityPollResponsesSuccessSubscription.unsubscribe();
    }
  }

  selectOption(selected: number) {
    this.selectedOption = selected;
  }

  submitPollResponse(communityPollId: string, selectedResponseId: string) {
    this.store.dispatch(new fromCommunityPollRequestActions.SubmittingCommunityPollRequest(
      { communityPollId: communityPollId, selectedResponseId: selectedResponseId} ));
  }

  onCarouselSlideChange(): void {
    this.selectedOption = null;
  }

  includesCommunityPollId(communityPollId: string): boolean {
    return this.userSubmittedResponses.some(x => x.CommunityPollId === communityPollId);
  }

  isResponseDismissed(communityPollId: string): boolean {
    return this.dismissedPollIds.some(x => x === communityPollId);
  }

  getResponsePercentage(responseId: number, communityPollId: string): number {
    const communityPollUserResponses = this.userSubmittedResponses.find( x => x.CommunityPollId === communityPollId);
    if (communityPollUserResponses == null) {
      return 0;
    }
    return communityPollUserResponses.ResponsePercents[responseId];
  }

  dismissPoll(communityPollId: string): void {

    this.dismissedPollIds.push(communityPollId);

    this.store.dispatch(new fromCommunityPollResponseActions.DismissingCommunityPollResponse(
      { communityPollId: communityPollId } ));

      const response = this.userSubmittedResponses.find(x => x.CommunityPollId === communityPollId);
      if (response != null) {
        response.IsDismissed = true;
      }
  }
}
