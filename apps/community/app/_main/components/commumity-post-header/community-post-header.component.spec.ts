import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPostReducer from '../../reducers';
import { generateMockCommunityUserInfo } from 'libs/models/community/community-user-info.model';

import { CommunityPostHeaderComponent } from './community-post-header.component';


describe('CommunityPostsComponent', () => {
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

    store = TestBed.get(Store);

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
});
