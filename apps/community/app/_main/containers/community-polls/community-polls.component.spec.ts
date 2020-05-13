import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { CommunityPollResponse, generateMockCommunityPollResponse } from 'libs/models/community/community-poll-response.model';

import * as fromCommunityPollRequestReducer from '../../reducers';
import { CommunityPollsComponent } from './community-polls.component';

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

    store = TestBed.inject(Store);

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

  it('should return true when calling getPollResponse with included CommunityPollId', () => {
    const communityPollId = '99';
    const responseId = 1;
    const userSubmittedResponses: CommunityPollResponse[] =
      [ { ...generateMockCommunityPollResponse(), CommunityPollId: communityPollId, ResponsePercents: [ 2, 3, 4 ] } ];

    instance.userSubmittedResponses = userSubmittedResponses;

    expect(instance.getPollResponse(communityPollId)).toBe(userSubmittedResponses[0]);
  });

});
