import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommunityPollRequest, CommunityPollResponse } from 'libs/models';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';

@Component({
  selector: 'pf-community-poll',
  templateUrl: './community-poll.component.html',
  styleUrls: ['./community-poll.component.scss']
})
export class CommunityPollComponent implements OnInit, OnDestroy {

  @Input() public request: CommunityPollRequest;
  @Input() public response: CommunityPollResponse;
  @Input() public type = CommunityPollTypeEnum.CommunityPoll;

  communityPollResponses$: Observable<CommunityPollResponse[]>;
  communityPolResponseSubmitted$: Observable<CommunityPollResponse>;

  communityPollResponseSubmittedSubscription: Subscription;

  selectedOption: number;
  dismissedPollIds: string[] = [];
  pollTypes = CommunityPollTypeEnum;

  constructor(public store: Store<fromCommunityPollReducer.State>) {
    this.communityPollResponses$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollResponsesSuccess);
    this.communityPolResponseSubmitted$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponses);
  }

  ngOnInit() {
    this.communityPollResponseSubmittedSubscription = this.communityPolResponseSubmitted$.subscribe(response => {
      if (response != null && response.CommunityPollId === this.request.CommunityPollId) {
        this.response = response;
      }
    });
  }

  ngOnDestroy() {
    if (this.communityPollResponseSubmittedSubscription) {
      this.communityPollResponseSubmittedSubscription.unsubscribe();
    }
  }

  selectOption(selected: number) {
    this.selectedOption = selected;
  }

  getPercentage(responseId: number): number {
    return this.response.ResponsePercents[responseId] <= 0 ? 100 : this.response.ResponsePercents[responseId];
  }

  submitPollResponse(communityPollId: string, selectedResponseId: string) {
    this.store.dispatch(new fromCommunityPollRequestActions.SubmittingCommunityPollRequest(
      { communityPollId: communityPollId, selectedResponseId: selectedResponseId} ));
  }

  isResponseDismissed(communityPollId: string): boolean {
    return this.dismissedPollIds.some(x => x === communityPollId);
  }

  dismissPoll(communityPollId: string): void {
    this.dismissedPollIds.push(communityPollId);

    this.store.dispatch(new fromCommunityPollResponseActions.DismissingCommunityPollResponse(
      { communityPollId: communityPollId } ));
  }

}
