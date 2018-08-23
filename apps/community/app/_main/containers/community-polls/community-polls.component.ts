import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';

import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';
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
  communityPollDismissResponseSuccess$: Observable<boolean>;
  communityPollResponsesSuccess$: Observable<CommunityPollResponse[]>;

  communityPollResponsesSuccessSubscription: Subscription;
  userSubmittedResponses: CommunityPollResponse[];

  constructor(public store: Store<fromCommunityPollReducer.State>) {
    this.communityPollRequests$ = this.store.select(fromCommunityPollReducer.getCommunityPollRequests);
    this.communityPollRequestsLoading$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollRequests);
    this.communityPollRequestResponses$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponses);
    this.communityPollResponseSubmitting$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponse);

    this.communityPollResponsesSuccess$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollResponsesSuccess);
  }

  ngOnInit() {
    this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
    this.store.dispatch(new fromCommunityPollResponseActions.LoadingCommunityPollResponses());

    this.communityPollResponsesSuccessSubscription = this.communityPollResponsesSuccess$.subscribe(responses => {
      if (responses != null) {

        // this.userSubmittedResponses = responses; - doing this will make userSubmittedResponses immutable,
        // since 'responses' comes from ngrx store as deep frozen. We don't want that.
        this.userSubmittedResponses = responses.map(o => {
          return { CommunityPollId: o.CommunityPollId, ResponsePercents: o.ResponsePercents, IsDismissed: false };
        });
      }
    });

    this.communityPollRequestResponsesSubscription = this.communityPollRequestResponses$.subscribe(responses => {
      if (responses != null) {
        // need to return both questions and responses that have not been dismissed
        this.store.dispatch(new fromCommunityPollRequestActions.LoadingCommunityPollRequests());
        this.store.dispatch(new fromCommunityPollResponseActions.LoadingCommunityPollResponses());
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

  isResponseDismissed(communityPollId: string): boolean {
    return this.userSubmittedResponses.some(x => x.CommunityPollId === communityPollId  && x.IsDismissed);
  }

  getResponsePercentage(responseId: number, communityPollId: string): number {
    const communityPollUserResponses = this.userSubmittedResponses.find( x => x.CommunityPollId === communityPollId);
    if (communityPollUserResponses === null) {
      return 0;
    }
    return communityPollUserResponses.ResponsePercents[responseId];
  }

  dismissPoll(communityPollId: string): void {

    this.store.dispatch(new fromCommunityPollResponseActions.DismissingCommunityPollResponse(
      { communityPollId: communityPollId } ));

      const response = this.userSubmittedResponses.find(x => x.CommunityPollId === communityPollId);
      if (response != null) {
        response.IsDismissed = true;
      }
  }
}
