import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromAddJobsPageActions from '../../../actions/add-jobs.page.actions';

import * as fromAddJobsReducer from '../../../reducers';
import { AddJobsPageComponent } from './add-jobs.page';


describe('Project - Add Data - Surveys Page', () => {
  let fixture: ComponentFixture<AddJobsPageComponent>;
  let instance: AddJobsPageComponent;
  let store: Store<fromAddJobsReducer.State>;

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
        AddJobsPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(AddJobsPageComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a close survey search action, when handling cancel clicked', () => {
    const expectedAction = new fromAddJobsPageActions.CloseJobsSearch();
    spyOn(store, 'dispatch');

    instance.handleCancelClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
