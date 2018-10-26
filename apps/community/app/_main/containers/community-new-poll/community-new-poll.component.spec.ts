import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostActions from '../../actions/community-post.actions';


import { HighlightHashTagPipe } from 'libs/core';
import { CommunityNewPollComponent } from './community-new-poll.component';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';

describe('CommunityStartPollComponent', () => {
  let fixture: ComponentFixture<CommunityNewPollComponent>;
  let instance: CommunityNewPollComponent;
  let store: Store<fromRootState.State>;
  let formBuilder: FormBuilder;

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
    formBuilder = TestBed.get(FormBuilder);

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
      ResponseOptions: ['yes', 'no']
    };


    instance.communityPollForm = formBuilder.group({
      'communityPollId': [''],
      'context': [newPoll.Question, [Validators.required, Validators.minLength(1), Validators.maxLength(instance.maxTextLength)]],
      'status': [newPoll.Status],
      'choices': formBuilder.array([]),
      'days':  [1],
      'hours': [0]
    });

    instance.choices.push(CommunityPollChoicesComponent.buildItem('yes'));
    instance.choices.push(CommunityPollChoicesComponent.buildItem('no'));

    instance.submit();

    const expectedAction = new fromCommunityPostActions.AddingCommunityDiscussionPoll(newPoll);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
