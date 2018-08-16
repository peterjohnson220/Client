import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import { CommunityStartDiscussionComponent } from './community-start-discussion.component';

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
        CommunityStartDiscussionComponent
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
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
