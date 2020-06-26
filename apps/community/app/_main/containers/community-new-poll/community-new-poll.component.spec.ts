import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';

import { PfLinkifyService } from '../../services/pf-linkify-service';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityNewPollComponent } from './community-new-poll.component';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';

describe('CommunityStartPollComponent', () => {
  let fixture: ComponentFixture<CommunityNewPollComponent>;
  let instance: CommunityNewPollComponent;
  let store: Store<fromRootState.State>;
  let formBuilder: FormBuilder;
  let pfLinkifyService: PfLinkifyService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: PfLinkifyService,
          useValue: { getLinks: jest.fn() }
        }
      ],
      declarations: [
        CommunityNewPollComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(store, 'dispatch');

    pfLinkifyService = TestBed.inject(PfLinkifyService);
    fixture = TestBed.createComponent(CommunityNewPollComponent);
    instance = fixture.componentInstance;

    instance.buildForm();
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
      ResponseOptions: ['yes', 'no'],
      Links: undefined,
      TopicId: 'TestTopic'
    };

    instance.communityPollForm = formBuilder.group({
      'communityPollId': [''],
      'content': [newPoll.Question, [Validators.required, Validators.minLength(1), Validators.maxLength(instance.maxTextLength)]],
      'status': [newPoll.Status],
      'choices': formBuilder.array([CommunityPollChoicesComponent.buildItem('yes'), CommunityPollChoicesComponent.buildItem('no')]),
      'days':  [1],
      'hours': [0],
      'topic': ['TestTopic', [ Validators.required]]
    });

    instance.submit();

    const expectedAction = new fromCommunityPostActions.AddingCommunityDiscussionPoll(newPoll);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should show community poll duration choices', () => {
    instance.onDurationDaysChange();
    expect(fixture).toBeTruthy();
  });

});
