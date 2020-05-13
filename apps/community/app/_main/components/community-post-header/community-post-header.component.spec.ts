import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { generateMockCommunityUserInfo } from 'libs/models/community/community-user-info.model';

import { CommunityPostHeaderComponent } from './community-post-header.component';
import { CommunityDeletePost } from '../../models/community-delete-post.model';
import { CompanySecurityApiService } from 'libs/data/payfactors-api/security/company-security-api.service';
import { of } from 'rxjs';


describe('CommunityPostHeaderComponent', () => {
  let fixture: ComponentFixture<CommunityPostHeaderComponent>;
  let instance: CommunityPostHeaderComponent;
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
        CommunityPostHeaderComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostHeaderComponent);
    instance = fixture.componentInstance;
  });

  it('should show community post header', () => {
      instance.user = generateMockCommunityUserInfo();
      instance.time = '3 days ago';
      instance.isInternalOnly = false;
      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
  });

  it('should show internal community post header', () => {
    instance.user = generateMockCommunityUserInfo();
    instance.time = '3 days ago';
    instance.isInternalOnly = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should call DeleteReply when isReply is true while calling delete', () => {
    instance.postId = '1';
    instance.isReply = true;

    spyOn(instance, 'deleteReply');

    instance.delete();

    expect(instance.deleteReply).toHaveBeenCalled();
  });

  it('should call DeletePost when isReply is false while calling delete', () => {
    instance.postId = '1';
    instance.isReply = false;

    spyOn(instance, 'deletePost');

    instance.delete();

    expect(instance.deletePost).toHaveBeenCalled();
  });

  it('should dispatch DeletingCommunityPost when deletePost is called', () => {
    instance.postId = '1';
    instance.isInternalOnly = false;

    instance.deletePost();
    const post: CommunityDeletePost = {
      PostId: instance.postId,
      IsInternalOnly: instance.isInternalOnly,
      HasReplies: instance.hasReplies,
      IsUserPoll: instance.isUserPoll
    };
    const expectedAction = new fromCommunityPostActions.DeletingCommunityPost(post);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch DeletingCommunityPostReply when deleteReply is called', () => {
    instance.postId = '1';
    instance.replyId = '2';
    instance.isInternalOnly = false;

    instance.deletePost();
    const post: CommunityDeletePost = {
      PostId: instance.postId,
      IsInternalOnly: instance.isInternalOnly,
      HasReplies: instance.hasReplies,
      IsUserPoll: instance.isUserPoll };
    const expectedAction = new fromCommunityPostActions.DeletingCommunityPost(post);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
