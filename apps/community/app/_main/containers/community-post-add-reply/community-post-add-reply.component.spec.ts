import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import { CommunityPostAddReplyComponent } from './community-post-add-reply.component';


describe('CommunityPostAddReplyComponent', () => {
  let fixture: ComponentFixture<CommunityPostAddReplyComponent>;
  let instance: CommunityPostAddReplyComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPostReplyReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPostAddReplyComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostAddReplyComponent);
    instance = fixture.componentInstance;
  });

  it('should show community add reply', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it ('should dispatch AddingCommunityPostReply when calling submitReply', () => {

    instance.postId = '99';
    instance.communityPostReplyForm.controls['context'].setValue('hello world');

    const newReply: any = {
      PostId: '99',
      ReplyText: 'hello world'
    };
    const expectedAction = new fromCommunityPostReplyActions.AddingCommunityPostReply(newReply);

    instance.submitReply();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
