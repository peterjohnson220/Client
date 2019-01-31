import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {combineReducers, Store, StoreModule} from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { JobsPageComponent } from './jobs.page.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromJobsPageActions from '../../../actions/jobs-page.actions';

describe('Comphub - Jobs Page', () => {
  let instance: JobsPageComponent;
  let fixture: ComponentFixture<JobsPageComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        })
      ],
      declarations: [ JobsPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobsPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispatch an action when filter changed', () => {

    spyOn(store, 'dispatch');

    const expectedAction = new fromJobsPageActions.GetJobSearchOptions('test');

    instance.handleJobSearchFilterChange('test');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action when valid search option selected', () => {

    spyOn(store, 'dispatch');

    instance.potentialOptions = ['Job A'];
    const expectedAction = new fromJobsPageActions.SetSelectedJob('job a');

    instance.handleJobSearchValueChanged('job a');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch a set selected job action when invalid search option selected', () => {

    spyOn(store, 'dispatch');

    instance.potentialOptions = ['Job B', 'Job C'];
    const expectedAction = new fromJobsPageActions.SetSelectedJob('Job A');

    instance.handleJobSearchValueChanged('Job A');

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a set selected job action when search term cleared', () => {

    spyOn(store, 'dispatch');

    const expectedAction = new fromJobsPageActions.SetSelectedJob('');

    instance.handleJobSearchValueChanged('');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should emit an event when next clicked', () => {
    spyOn(instance.navigateToNext, 'emit');

    instance.nextButtonClicked();

    expect(instance.navigateToNext.emit).toHaveBeenCalledWith();
  });

  it('should dispatch a set selected job action when the search is changed to empty filter', () => {

    spyOn(store, 'dispatch');

    const expectedAction = new fromJobsPageActions.SetSelectedJob('');

    instance.handleJobSearchFilterChange('');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch a set selected job action when the search is changed to a non empty filter', () => {

    spyOn(store, 'dispatch');

    const expectedAction = new fromJobsPageActions.SetSelectedJob('Something else');

    instance.handleJobSearchFilterChange('Something else');

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });


});
