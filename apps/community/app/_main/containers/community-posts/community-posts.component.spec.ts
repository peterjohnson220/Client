import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';
import { CommunityPostsComponent } from './community-posts.component';
import { HighlightHashTagPipe, FormatLinkUrlPipe, NewLinePipe } from 'libs/core';
import { CommunityPost } from 'libs/models/community/community-post.model';
import { generateMockCommunityPost } from 'libs/models/community/community-post.model';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

describe('CommunityPostsComponent', () => {
  let fixture: ComponentFixture<CommunityPostsComponent>;
  let instance: CommunityPostsComponent;
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
        CommunityPostsComponent,
        HighlightHashTagPipe,
        FormatLinkUrlPipe,
        NewLinePipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostsComponent);
    instance = fixture.componentInstance;
  });

  it('should show community posts', () => {
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

  it('should hide the replies when hdie replies clicked', () => {
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
  it('should return the id for tracking purposes ', () => {
    const filter: CommunityPost = generateMockCommunityPost();

    const postId = instance.trackByPostId(5, filter);

    expect(postId).toBe(filter.Id);
  });

  it('should dispatch on clearing the replies from the add view', () => {
    const postId = 1;
    const parameter = {
      PostId: postId
    };
    const action = new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies(parameter);
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

  it('should dispatch GettingCommunityPostsByTag when calling onMessage', () => {
    const tag = 'testTag';

    const messageParam = {
      data: {action: 'getCommunityPostsByTag', tag: tag},
    };

    const actionParam = {tag: tag};
    const action = new fromCommunityPostActions.GettingCommunityPostsByTag(actionParam);

    instance.onMessage(messageParam);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
