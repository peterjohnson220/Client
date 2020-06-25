import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import 'rxjs/add/observable/of';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

import { CommunityPostComponent } from './community-post.component';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';
import { of } from 'rxjs';

describe('CommunityPostComponent', () => {
  let fixture: ComponentFixture<CommunityPostComponent>;
  let instance: CommunityPostComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        ReactiveFormsModule
      ],
      declarations: [ CommunityPostComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostComponent);
    instance = fixture.componentInstance;
    instance.post = generateMockCommunityPost();

    instance.discardingPostId$ = of('test');
    instance.discardingPostReplyProceed$ = of(false);

  }));

  it('should show component', () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  it('should show post', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });


  it('should show the replies when show replies clicked', () => {
    const postId = 1;
    instance.showReplies = false;
    instance.getReplies(postId);

    expect(instance.showReplies).toBe(true);
  });

  it('should hide the replies when hide replies clicked', () => {
    const postId = 1;
    instance.showReplies = true;
    instance.hideReplies(postId);

    expect(instance.showReplies).toBe(false);
  });

  it('should show reply area when reply link clicked', () => {
    instance.showAddReply = false;
    instance.showReply();

    expect(instance.showAddReply).toBe(true);
  });

  it('should show reply area when onreplysubmitted', () => {

    instance.showAddReply = false;
    instance.onReplySubmitted();

    expect(instance.showAddReply).toBe(true);
  });

  it('should dispatch on clearing the replies from the add view', () => {
    const action = new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies();
    instance.clearRepliesFromAddView();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch on getting community post replies', () => {
    const postId = 1;
    const parameter = {
      PostId: postId
    };
    const action = new fromCommunityPostReplyActions.GettingCommunityPostReplies(parameter);
    instance.getCommunityPostReplies(postId);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
