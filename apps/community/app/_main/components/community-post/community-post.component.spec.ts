import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs/add/observable/of';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

import { CommunityPostComponent } from './community-post.component';
import { CommunityPost } from 'libs/models/community/community-post.model';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';

describe('CommunityPostComponent', () => {
  let fixture: ComponentFixture<CommunityPostComponent>;
  let instance: CommunityPostComponent;
  let store: Store<fromRootState.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPostReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [ CommunityPostComponent ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostComponent);
    instance = fixture.componentInstance;
    instance.post = generateMockCommunityPost();
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
    const item = 1;
    const postId = 1;
    instance.showReplies[item] = false;
    instance.getReplies(item, postId);

    expect(instance.showReplies[item]).toBe(true);
  });

  it('should hide the replies when hide replies clicked', () => {
    const item = 1;
    const postId = 1;
    instance.showReplies[item] = true;
    instance.hideReplies(item, postId);

    expect(instance.showReplies[item]).toBe(false);
  });

  it('should show reply area when reply link clicked', () => {
    const item = 1;

    instance.showAddReply[item] = false;
    instance.showReply(item);

    expect(instance.showAddReply[item]).toBe(true);
  });

  it('should show reply area when onreplysubmitted', () => {
    const item = 1;

    instance.showAddReply[item] = false;
    instance.onReplySubmitted(item);

    expect(instance.showAddReply[item]).toBe(true);
  });

  it('should dispatch on clearing the replies from the add view', () => {
    const postId = 1;
    const action = new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies();
    instance.clearRepliesFromAddView(postId);
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
