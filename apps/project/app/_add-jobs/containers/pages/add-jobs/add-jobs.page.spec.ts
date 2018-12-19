import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromAddJobsPageActions from '../../../actions/add-jobs.page.actions';
import * as fromPaymarketActions from '../../../actions/paymarkets.actions';
import * as fromAddJobsSearchResultsActions from '../../../actions/search-results.actions';
import * as fromAddJobsReducer from '../../../reducers';

import { AddJobsPageComponent } from './add-jobs.page';

describe('Project - Add Jobs - Jobs Page', () => {
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

  it('should dispatch a set context action onSetContext', () => {
    const payload = {
      PayMarketId: 123,
      ProjectId: 1
    };
    const expectedAction = new fromAddJobsPageActions.SetContext(payload);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a load paymarkets action onSetContext', () => {
    const payload = {
      PayMarketId: 123,
      ProjectId: 1
    };
    const expectedAction = new fromPaymarketActions.LoadPaymarkets();

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a set default paymarket action', () => {
    const payload = {
      PayMarketId: 123,
      ProjectId: 1
    };
    const expectedAction = new fromPaymarketActions.SetDefaultPaymarket(123);

    spyOn(store, 'dispatch');

    instance.onSetContext(payload);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a reset paymarkets action onResetApp', () => {
    const expectedAction = new fromPaymarketActions.ResetPaymarkets();

    spyOn(store, 'dispatch');

    instance.onResetApp();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a clear job search results action onResetApp', () => {
    const expectedAction = new fromAddJobsSearchResultsActions.ClearSelectedJobs();

    spyOn(store, 'dispatch');

    instance.onResetApp();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
