import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostReplyReducer from '../../reducers';

import * as fromCommunityLikeActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import { CommunityLikeComponent } from './community-like.component';

describe('CommunityLikeComponent', () => {
  let fixture: ComponentFixture<CommunityLikeComponent>;
  let instance: CommunityLikeComponent;
  let store: Store<fromCommunityPostReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPost: combineReducers(fromCommunityPostReducer.reducers),
          communityPostReply:  combineReducers(fromCommunityPostReplyReducer.reducers)
        }),
        ],
        declarations: [
        CommunityLikeComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityLikeComponent);
    instance = fixture.componentInstance;
    instance.communityLikeUserInfos = [];
  });

  it('should show like component', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display as liked if LikedByCurrentUser === true', () => {
    instance.LikedByCurrentUser = true;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should display as not liked if LikedByCurrentUser === false', () => {
    instance.LikedByCurrentUser = false;

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch UpdatingCommunityPostLike when calling updateLike and ReplyId === undefined', () => {
    const likedByCurrentUser = true;

    instance.PostId = '1234';
    instance.LikedByCurrentUser = likedByCurrentUser;
    instance.updateLike();

    const replyResult = {postId: '1234', like: !likedByCurrentUser};
    const expectedAction = new fromCommunityLikeActions.UpdatingCommunityPostLike(replyResult);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
  it('should dispatch UpdatingCommunityPostReplyLike when calling updateLike and ReplyId != undefined', () => {
    const likedByCurrentUser = true;

    instance.PostId = '1234';
    instance.ReplyId = '12345';
    instance.LikedByCurrentUser = likedByCurrentUser;
    instance.updateLike();

    const replyResult = {postId: '1234', replyId: '12345', like: !likedByCurrentUser};
    const expectedAction = new fromCommunityPostReplyActions.UpdatingCommunityPostReplyLike(replyResult);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
