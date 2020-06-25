import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({type: 'poll'})
          }
        }
      ],
      declarations: [
        CommunityStartDiscussionComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

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

  it('should set the post type to when clicking post type button', () => {
    const postType = instance.CommunityPostTypes.Discussion;

    instance.onPostTypeClick(postType);
    expect(instance.postType).toEqual(instance.CommunityPostTypes.Discussion);
  });
});
