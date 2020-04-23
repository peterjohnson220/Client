import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommunityPollRequest, CommunityPollResponse } from 'libs/models';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityDismissPoll } from 'libs/models/community/community-dismiss-poll.model';

@Component({
  selector: 'pf-community-poll',
  templateUrl: './community-poll.component.html',
  styleUrls: ['./community-poll.component.scss']
})
export class CommunityPollComponent implements OnInit, OnDestroy {

  @Input() public request: CommunityPollRequest;
  @Input() public response: CommunityPollResponse;
  @Input() public type = CommunityPollTypeEnum.CommunityPoll;
  @Input() public isCurrentUserPost: boolean;
  @Output() public pollHashTagClicked  = new EventEmitter();

  communityPollResponses$: Observable<CommunityPollResponse[]>;
  communityPolResponseSubmitted$: Observable<CommunityPollResponse>;
  hasNonDismissedResponses$: Observable<boolean>;

  communityPollResponseSubmittedSubscription: Subscription;

  selectedOption: number;
  dismissedPollIds: string[] = [];
  pollTypes = CommunityPollTypeEnum;
  showResults = false;

  constructor(public store: Store<fromCommunityPollReducer.State>) {
    this.communityPollResponses$ = this.store.select(fromCommunityPollReducer.getGettingCommunityPollResponsesSuccess);
    this.communityPolResponseSubmitted$ = this.store.select(fromCommunityPollReducer.getSubmittingCommunityPollRequestResponses);
    this.hasNonDismissedResponses$ = this.store.select(fromCommunityPollReducer.hasNonDismissedResponses);
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

  isMostSelected(responseId: number, votes: any) {

    const allEqual = votes.every( (val, i, arr) => val === arr[0] );

    if (allEqual) {
      return false;
    }

    const index = this.indexOfMax();
    if (index === responseId) {
      return true;
    }
    return false;

  }

  indexOfMax() {

    if (!this.response || !this.response.ResponsePercents) {
      return -1;
    }
    if (this.response.ResponsePercents.length === 0) {
      return -1;
    }

    let max = this.response.ResponsePercents[0];
    let maxIndex = 0;

    for (let i = 1; i < this.response.ResponsePercents.length; i++) {
      if (this.response.ResponsePercents[i] > max) {
        maxIndex = i;
        max = this.response.ResponsePercents[i];
      }
    }

    return maxIndex;
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

    const dismissPoll: CommunityDismissPoll = {
      communityPollId: communityPollId
    };
    this.store.dispatch(new fromCommunityPollResponseActions.DismissingCommunityPollResponse(dismissPoll));
  }
  handleHashTagClicked(event: any) {
    this.pollHashTagClicked.emit(event);
  }
  jumpToResults() {
    this.showResults = true;
  }

  backToPoll() {
    this.showResults = false;
  }

  showJumpToResults(votes: any) {
    // FORT-332 - Hide jump to results button
    return false;

    let sum = 0;

    if (votes) {
      for (let i = 0; i < votes.length; i++) {
        sum += votes[ i ];
      }
    }
    if (sum === 0) {
      return false;
    }
    return sum;
  }
}
