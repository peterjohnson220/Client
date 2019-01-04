import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';

import * as fromAddJobsPageActions from '../../../actions/add-jobs-page.actions';
import * as fromPaymarketActions from '../../../actions/paymarkets.actions';
import * as fromAddJobsSearchResultsActions from '../../../actions/search-results.actions';
import * as fromAddJobsReducer from '../../../reducers';

import { AddJobsPageComponent } from './add-jobs.page';
import { ActivatedRoute, Router } from '@angular/router';

describe('Project - Add Jobs - Jobs Page', () => {
  let fixture: ComponentFixture<AddJobsPageComponent>;
  let instance: AddJobsPageComponent;
  let store: Store<fromAddJobsReducer.State>;
  let router: Router;
  let route: ActivatedRoute;

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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { url: 'fake-path/' }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

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

  it('should dispatch a clear paymarkets action onResetApp', () => {
    const expectedAction = new fromPaymarketActions.ClearPayMarkets();

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

  it('should dispatch a clear job search results action when handling clear selections clicked', () => {
    const expectedAction = new fromAddJobsSearchResultsActions.ClearSelectedJobs();

    spyOn(store, 'dispatch');

    instance.handleClearSelectionsClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should navigate to the create-new-job route relative to this one, when handling create new job clicked', () => {
    spyOn(router, 'navigate');

    instance.handleCreateNewJobClicked();

    expect(router.navigate).toHaveBeenCalledWith(['../create-new-job'], { relativeTo: route });
  });

});
