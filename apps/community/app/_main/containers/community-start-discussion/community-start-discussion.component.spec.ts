import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import { CommunityStartDiscussionComponent } from './community-start-discussion.component';
import { HighlightHashTagPipe } from 'libs/core';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { CommunityAddPost } from '../../../../../../libs/models/community';

describe('CommunityStartDiscussionComponent', () => {
  let fixture: ComponentFixture<CommunityStartDiscussionComponent>;
  let instance: CommunityStartDiscussionComponent;
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
        CommunityStartDiscussionComponent,
        HighlightHashTagPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityStartDiscussionComponent);
    instance = fixture.componentInstance;
  });

  it('should show community start discussion', () => {
    instance.postType = instance.CommunityPostTypes.Discussion;
    expect(fixture).toMatchSnapshot();
  });

  it('should show community start poll', () => {
    instance.postType = instance.CommunityPostTypes.Question;
    expect(fixture).toMatchSnapshot();
  });
});
