import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollRequestActions from '../../actions/community-poll-request.actions';
import * as fromCommunityPollRequestReducer from '../../reducers';

import { CommunityPollsComponent } from './community-polls.component';

describe('ItemFormControlComponent', () => {
  let fixture: ComponentFixture<CommunityPollsComponent>;
  let instance: CommunityPollsComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityPollRequest: combineReducers(fromCommunityPollRequestReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        CommunityPollsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPollsComponent);
    instance = fixture.componentInstance;
  });

  it('should show polls', () => {
    expect(fixture).toBeTruthy();
  });

  it('should show the form text', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
