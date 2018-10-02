import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollRequestReducer from '../../reducers';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';

import { HighlightHashTagPipe } from 'libs/core';
import { CommunityNewPollComponent } from './community-new-poll.component';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

describe('CommunityStartPollComponent', () => {
  let fixture: ComponentFixture<CommunityNewPollComponent>;
  let instance: CommunityNewPollComponent;
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
        CommunityNewPollComponent,
        HighlightHashTagPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityNewPollComponent);
    instance = fixture.componentInstance;
  });

  it('should show community start poll', () => {
    expect(fixture).toMatchSnapshot();
  });

  // TODO: Add units tests when implementing poll submit functionality.
  it('should dispatch AddingCommunityUserPoll when calling submit', () => {

    const newPoll: CommunityPollUpsertRequest = {
      CommunityPollId: '',
      Question: 'Question',
      Status: 1,
      DurationInHours: 24,
      ResponseOptions: []
    };

    instance.communityPollForm.get('context').setValue(newPoll.Question);
    instance.communityPollForm.get('status').setValue(newPoll.Status);
    instance.communityPollForm.get('hours').setValue(newPoll.DurationInHours);

    instance.submit();

    const expectedAction = new fromCommunityPollRequestActions.AddingCommunityUserPoll(newPoll);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


});
