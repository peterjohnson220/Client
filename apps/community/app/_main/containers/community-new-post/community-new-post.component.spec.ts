import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityAddPost } from 'libs/models';
import { CommunityNewPostComponent } from './community-new-post.component';

describe('CommunityNewPostComponent', () => {
  let fixture: ComponentFixture<CommunityNewPostComponent>;
  let instance: CommunityNewPostComponent;
  let store: Store<fromRootState.State>;

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
      declarations: [
        CommunityNewPostComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

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

});
