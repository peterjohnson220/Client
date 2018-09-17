import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityPostRepliesComponent } from './community-post-replies.component';

describe('CommunityPostsComponent', () => {
  let fixture: ComponentFixture<CommunityPostRepliesComponent>;
  let instance: CommunityPostRepliesComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPost: combineReducers(fromCommunityPostReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPostRepliesComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostRepliesComponent);
    instance = fixture.componentInstance;
  });

  it('should show community post replies', () => {
    instance.loading = false;
    instance.replies = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show community post replies loading indicator', () => {
    instance.loading = true;
    instance.replies = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch UpdatingCommunityPostReplyLike when calling updateReplyLike', () => {
    const likedByCurrentUser = true;
    const replyPayload = {PostId: '1234', Id: '12345', LikedByCurrentUser: likedByCurrentUser};
    instance.updateReplyLike(replyPayload);

    const replyResult = {postId: '1234', replyId: '12345', like: !likedByCurrentUser};
    const expectedAction = new fromCommunityPostActions.UpdatingCommunityPostReplyLike(replyResult);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
