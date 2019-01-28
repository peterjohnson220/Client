import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { PfLinkifyService } from '../../services/pf-linkify-service';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityAddPost } from 'libs/models';
import { CommunityNewPostComponent } from './community-new-post.component';


describe('CommunityNewPostComponent', () => {
  let fixture: ComponentFixture<CommunityNewPostComponent>;
  let instance: CommunityNewPostComponent;
  let store: Store<fromRootState.State>;
  let pfLinkifyService: PfLinkifyService;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPostReducer.reducers)
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
        CommunityNewPostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');
    pfLinkifyService = TestBed.get(PfLinkifyService);

    fixture = TestBed.createComponent(CommunityNewPostComponent);
    instance = fixture.componentInstance;
  });

  it('should show community start poll', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should dispatch SubmittingCommunityPost when calling submit', () => {
    instance.communityDiscussionForm.get('context').setValue('hello world');
    instance.submit();

    const newPost: CommunityAddPost = {
      PostText: 'hello world',
      IsInternalOnly: false
    };

     const expectedAction = new fromCommunityPostActions.SubmittingCommunityPost(newPost);
     expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('it should return true when form is valid', () => {
    // Set required fields
    instance.communityDiscussionForm.controls['context'].setValue('this is the context');
    instance.communityDiscussionForm.controls['isInternalOnly'].setValue(false);

    const value = instance.isFormValid;
    expect(value).toBeTruthy();

  });
  it('form invalid when empty', () => {
    expect(instance.communityDiscussionForm.valid).toBeFalsy();
  });
  it('submitting invalid form does not submit post', () => {
    expect(instance.communityDiscussionForm.valid).toBeFalsy();

    instance.submit();

    expect(store.dispatch).toBeCalledTimes(0);
  });
});
