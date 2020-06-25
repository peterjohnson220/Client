import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReplyReducer from '../../reducers';
import { CommunityPostAddReplyViewComponent } from './community-post-add-reply-view.component';

describe('CommunityPostAddReplyViewComponent', () => {
  let fixture: ComponentFixture<CommunityPostAddReplyViewComponent>;
  let instance: CommunityPostAddReplyViewComponent;
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
        CommunityPostAddReplyViewComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPostAddReplyViewComponent);
    instance = fixture.componentInstance;
  });
  it('should show community add reply view', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
