import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollRequestReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

import { CommunityPollsComponent } from './community-polls.component';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

describe('ItemFormControlComponent', () => {
  let fixture: ComponentFixture<CommunityPollsComponent>;
  let instance: CommunityPollsComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPollRequestReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPollsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPollsComponent);
    instance = fixture.componentInstance;
  });

  it('should show polls', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should show the form text', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should change selectedOption when calling selectOption', () => {
    const selectionOptionValue = 1;
    instance.selectOption(selectionOptionValue);

    fixture.detectChanges();

    expect(instance.selectedOption).toEqual(selectionOptionValue);
  });

  it('should dispatch SubmittingCommunityPollRequest when calling submitPollResponse', () => {
    const communityPollId = '1';
    const selectedResponseId = '1';

    instance.submitPollResponse(communityPollId, selectedResponseId);

    const payload = { communityPollId: communityPollId, selectedResponseId: selectedResponseId };

    const expectedAction = new fromCommunityPollRequestActions.SubmittingCommunityPollRequest(payload);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);

  });

  it('should set selectedOption to null when onCarouselSlideChange is called', () => {
    instance.onCarouselSlideChange();

    expect(instance.selectedOption).toEqual(null);
  });

  it('should return true when calling includesCommunityPollId with included CommunityPollId', () => {
    const communityPollId = '99';
    const responseId = 1;
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { CommunityPollId: communityPollId, ResponsePercents: [ 2, 3, 4 ], IsDismissed: false } ];

    instance.userSubmittedResponses = userSubmittedResponses;

    expect(instance.includesCommunityPollId(communityPollId)).toBe(true);
  });

  it('should return false when calling includesCommunityPollId with not included CommunityPollId', () => {
    const communityPollId = '99';
    const responseId = 1;
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { CommunityPollId: '98', ResponsePercents: [ 2, 3, 4 ], IsDismissed: false } ];

    instance.userSubmittedResponses = userSubmittedResponses;

    expect(instance.includesCommunityPollId(communityPollId)).toBe(false);
  });

  it('should return true when calling isResponseDismissed with dismissed pollId', () => {
    instance.dismissedPollIds = [ '99' ];

    expect(instance.isResponseDismissed('99')).toBe(true);
  });

  it('should return false when calling isResponseDismissed with not dismissed pollId', () => {
    instance.dismissedPollIds = [ '99' ];

    expect(instance.isResponseDismissed('98')).toBe(false);
  });

  it('should return responsePercents when calling getResponsePercentage', () => {
    const communityPollId = '99';
    const responseId = 1;
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { CommunityPollId: communityPollId, ResponsePercents: [ 2, 3, 4 ], IsDismissed: false } ];


    instance.userSubmittedResponses = userSubmittedResponses;

    const responsePercentage = instance.getResponsePercentage(responseId, communityPollId);

    expect(userSubmittedResponses[ 0 ].ResponsePercents[ responseId ]).toEqual(responsePercentage);
  });

  it('should return 0 when calling getResponsePercentage when there is no valid userSubmittedResponse', () => {
    const communityPollId = '99';
    const responseId = 1;
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { CommunityPollId: '1', ResponsePercents: [ 2, 3, 4 ], IsDismissed: false } ];

    instance.userSubmittedResponses = userSubmittedResponses;

    const responsePercentage = instance.getResponsePercentage(responseId, communityPollId);

    expect(0).toEqual(responsePercentage);
  });

  it('should dispatch DismissingCommunityPollResponse when calling dismissPoll', () => {
    const communityPollId = '1';
    const selectedResponseId = '1';
    const userSubmittedResponses: CommunityPollResponse[] = [];

    instance.userSubmittedResponses = userSubmittedResponses;

    const payload = { communityPollId: communityPollId };
    const expectedAction = new fromCommunityPollResponseActions.DismissingCommunityPollResponse(payload);

    instance.dismissPoll(communityPollId);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set isDismissed to true when calling dismissPoll', () => {
    const communityPollId = '1';
    const selectedResponseId = '1';
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { CommunityPollId: '1', ResponsePercents: [ 2, 3, 4 ], IsDismissed: false } ];

    instance.userSubmittedResponses = userSubmittedResponses;

    const payload = { communityPollId: communityPollId };

    instance.dismissPoll(communityPollId);


    expect(userSubmittedResponses[ 0 ].IsDismissed).toEqual(true);
  });

});
