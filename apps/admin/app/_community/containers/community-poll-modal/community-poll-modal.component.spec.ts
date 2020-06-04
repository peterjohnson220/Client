import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

import { CommunityPollModalComponent } from './community-poll-modal.component';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

describe('CommunityPollModalComponent', () => {
  let fixture: ComponentFixture<CommunityPollModalComponent>;
  let instance: CommunityPollModalComponent;
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
        CommunityPollModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(CommunityPollModalComponent);
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

  it('should dispatch fromCommunityPollActions.EditingCommunityPoll when calling handleFormSubmit with isEditMode equal to true', () => {

    instance.isEditMode = true;
    instance.content.setValue('test');
    instance.communityPollId.setValue('1');

    instance.handleFormSubmit();

    const communityPollEditRequest: CommunityPollUpsertRequest = {
      CommunityPollId: '1',
      Question: 'test',
      ResponseOptions: [],
      Status: 0,
      Links: [],
      TopicId: ''
    };

    const action = new fromCommunityPollActions.EditingCommunityPoll(communityPollEditRequest);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch fromCommunityPollActions.AddingCommunityPoll when calling handleFormSubmit with isEditMode equal to false', () => {

    instance.isEditMode = false;
    instance.content.setValue('test');
    instance.communityPollId.setValue('1');

    fixture.detectChanges();
    instance.handleFormSubmit();

    const communityPollEditRequest: CommunityPollUpsertRequest = {
      CommunityPollId: '1',
      Question: 'test',
      ResponseOptions: [],
      Status: 0,
      Links: [],
      TopicId: ''
    };

    const action = new fromCommunityPollActions.AddingCommunityPoll(communityPollEditRequest);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an CloseAddCommunityPollModal action when handleModalDismissed is called', () => {
    const action = new fromCommunityPollActions.CloseCommunityPollModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it ('should call responses.push when calling addResponseOption', () => {
    spyOn(instance.choices, 'push');

    instance.addResponseOption();
    expect(instance.choices.push).toHaveBeenCalled();
  });

  it ('should return correct text when calling getTitle with editMode true', () => {
    instance.isEditMode = true;
    expect(instance.getTitle()).toEqual('Edit Poll');
  });

  it ('should return correct text when calling getTitle with editMode false', () => {
    instance.isEditMode = false;
    expect(instance.getTitle()).toEqual('New Poll');
  });

});
