import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockPayFactorsJobResult, JobResult } from 'libs/features/jobs/add-jobs/models';
import * as fromSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';

import { StructuresSearchResultsComponent } from './structures-search-results.component';

describe('Project - Structures Add Jobs - Search Results', () => {
  let fixture: ComponentFixture<StructuresSearchResultsComponent>;
  let instance: StructuresSearchResultsComponent;
  let store: Store<fromAddJobsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addJobs: combineReducers(fromAddJobsReducer.reducers)
        })
      ],
      declarations: [ StructuresSearchResultsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(StructuresSearchResultsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch job selection toggle action when clicking on a job', () => {
    const selectedJob: JobResult = generateMockPayFactorsJobResult();
    const expectedAction = new fromSearchResultsActions.ToggleJobSelection(selectedJob);

    instance.canSelectJobs = true;

    spyOn(store, 'dispatch');

    instance.handleJobSelectionToggle(selectedJob);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not select a job when canSelectJobs = false', () => {
    const selectedJob: JobResult = generateMockPayFactorsJobResult();

    instance.canSelectJobs = false;

    spyOn(store, 'dispatch');

    instance.handleJobSelectionToggle(selectedJob);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should unselect a selected job when canSelectJobs = false', () => {
    const selectedJob: JobResult = generateMockPayFactorsJobResult();
    const expectedAction = new fromSearchResultsActions.ToggleJobSelection(selectedJob);

    instance.canSelectJobs = true;

    spyOn(store, 'dispatch');

    // select the job
    instance.handleJobSelectionToggle(selectedJob);

    instance.canSelectJobs = false;

    // unselect the job
    instance.handleJobSelectionToggle(selectedJob);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
