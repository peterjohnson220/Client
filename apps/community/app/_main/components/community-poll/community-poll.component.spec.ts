import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityPollComponent } from './community-poll.component';
import { CommunityPollResponse, generateMockCommunityPollRequest, generateMockCommunityPollResponse } from 'libs/models';

describe('CommunityPollComponent', () => {
  let fixture: ComponentFixture<CommunityPollComponent>;
  let instance: CommunityPollComponent;
  let store: Store<fromRootState.State>;

    // Configure Testing Module for before each test
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({
            ...fromRootState.reducers,
            communityPollRequest: combineReducers(fromCommunityPollReducer.reducers)
          }),
          ReactiveFormsModule
        ],
        declarations: [
          CommunityPollComponent
        ],
        // Shallow Testing
        schemas: [ NO_ERRORS_SCHEMA ]
      });

      store = TestBed.get(Store);
      spyOn(store, 'dispatch');

      fixture = TestBed.createComponent(CommunityPollComponent);
      instance = fixture.componentInstance;

      instance.request = generateMockCommunityPollRequest();
      instance.response = generateMockCommunityPollResponse();
    });

    it('should show component', () => {
      fixture.detectChanges();
      expect(fixture).toBeTruthy();
    });

    it('should show poll', () => {
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

    it('should return true when calling isResponseDismissed with dismissed pollId', () => {
      instance.dismissedPollIds = [ '99' ];
      expect(instance.isResponseDismissed('99')).toBe(true);
    });

    it('should dispatch DismissingCommunityPollResponse when calling dismissPoll', () => {
      const communityPollId = '1';

      const payload = { communityPollId: communityPollId };
      const expectedAction = new fromCommunityPollResponseActions.DismissingCommunityPollResponse(payload);

      instance.dismissPoll(communityPollId);
      fixture.detectChanges();

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should push dismissed poll id to dismissedPollIds when calling dismissPoll', () => {
      const communityPollId = '1';
      instance.dismissPoll(communityPollId);

      expect(instance.dismissedPollIds).toContain(communityPollId);
    });

});
