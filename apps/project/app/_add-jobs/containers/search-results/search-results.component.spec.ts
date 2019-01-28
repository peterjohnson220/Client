import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromAddJobsReducer from '../../reducers';
import * as fromSearchResultsActions from '../../actions/search-results.actions';
import { SearchResultsComponent } from './search-results.component';
import { JobResult, generateMockPayFactorsJobResult } from '../../models';

describe('Project - Add Jobs - Search Results', () => {
  let fixture: ComponentFixture<SearchResultsComponent>;
  let instance: SearchResultsComponent;
  let store: Store<fromAddJobsReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addJobs: combineReducers(fromAddJobsReducer.reducers)
        })
      ],
      declarations: [ SearchResultsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(SearchResultsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should dispatch job selection toggle action when clicking on a job', () => {
    const selectedJob: JobResult = generateMockPayFactorsJobResult();
    const expectedAction = new fromSearchResultsActions.ToggleJobSelection(selectedJob);

    spyOn(store, 'dispatch');

    instance.handleJobSelectionToggle(selectedJob);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
