import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

import { AddCommunityPollModalComponent } from './add-community-poll-modal.component';

describe('AddCommunityPollModalComponent', () => {
  let fixture: ComponentFixture<AddCommunityPollModalComponent>;
  let instance: AddCommunityPollModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          communityAdminMain: combineReducers(fromCommunityPollReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        AddCommunityPollModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(AddCommunityPollModalComponent);
    instance = fixture.componentInstance;
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should show the form text and no error messages when a submit has not been attempted', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show the form text and should show a required error message once a submit has been attempted', () => {
    fixture.detectChanges();

    // trigger handleFormSubmit
    instance.handleFormSubmit();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an CloseAddCommunityPollModal action when handleModalDismissed is called', () => {
    const action = new fromCommunityPollActions.CloseAddCommunityPollModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
