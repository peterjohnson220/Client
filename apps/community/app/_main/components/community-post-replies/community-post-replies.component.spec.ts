import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';

import { CommunityPostsRepliesComponent } from './community-post-replies.component';


describe('CommunityPostsComponent', () => {
  let fixture: ComponentFixture<CommunityPostsRepliesComponent>;
  let instance: CommunityPostsRepliesComponent;
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
        CommunityPostsRepliesComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostsRepliesComponent);
    instance = fixture.componentInstance;
  });

  it('should show community post replies', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
