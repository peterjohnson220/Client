import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostActions from '../../actions/community-post.actions';


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
          ...fromRootState.reducers
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

  it('should dispatch AddingCommunityDiscussionPoll when calling submit', () => {

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

    const expectedAction = new fromCommunityPostActions.AddingCommunityDiscussionPoll(newPoll);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
