import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Location } from '@angular/common';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';

import * as fromCreateNewJobPageActions from '../../../actions/create-new-job-page.actions';
import * as fromAddJobsReducer from '../../../reducers';

import { CreateNewJobPageComponent } from './create-new-job.page';
import { FormBuilder } from '@angular/forms';

describe('Project - Add Jobs - Create New Job Page', () => {
  let fixture: ComponentFixture<CreateNewJobPageComponent>;
  let instance: CreateNewJobPageComponent;
  let store: Store<fromAddJobsReducer.State>;
  let location: Location;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addJobs: combineReducers(fromAddJobsReducer.reducers),
        })
      ],
      declarations: [
        CreateNewJobPageComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: Location,
          useValue: { back: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(CreateNewJobPageComponent);
    instance = fixture.componentInstance;

    // Fire OnInit
    fixture.detectChanges();
  });

  it('should dispatch an action to close the search page, when handling cancel being clicked', () => {
    const expectedAction = new fromSearchPageActions.CloseSearchPage();

    spyOn(store, 'dispatch');

    instance.handleCancelClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should go back to the previous location, when handling back to search clicked', () => {
    spyOn(location, 'back');

    instance.handleBackToSearchClicked();

    expect(location.back).toHaveBeenCalled();
  });

  it('should dispatch an action to clear the job code exists error, when handling job code changed, ' +
    'and there is an error message showing', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromCreateNewJobPageActions.ClearJobCodeExistsError();
    instance.jobCodeExists = true;

    instance.handleJobCodeChanged();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch an action to clear the job code exists error, when handling job code changed, ' +
    'and there is no error message showing', () => {
    spyOn(store, 'dispatch');
    instance.jobCodeExists = false;

    instance.handleJobCodeChanged();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch an action to create a job with form data, when handling create clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromCreateNewJobPageActions.CreateJob({
      jobCode: '',
      jobDescription: '',
      jobFamily: '',
      jobLevel: '',
      jobTitle: ''
    });

    instance.handleCreateClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
