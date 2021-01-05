import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import spyOn = jest.spyOn;
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockUserContext } from 'libs/models/security';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromPaymarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromAddJobsPageActions from 'libs/features/jobs/add-jobs/actions/add-jobs-page.actions';
import * as fromAddJobsSearchResultsActions from 'libs/features/jobs/add-jobs/actions/search-results.actions';

import { AddJobsPageComponent } from './add-jobs.page';
import * as fromAddJobsReducer from '../../../../../../../apps/project/app/_add-jobs/reducers';

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
        }),
        NgbProgressbarModule
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
        },
        {
          provide: SettingsService,
          useClass: SettingsService
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

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

  it('should not display GUI features related to job count in non small biz companies, and should display the "normal"' +
    ' result count ', () => {
    instance.pageShown$ = of(true);
    instance.numberOfResults$ = of(100);
    instance.userContext = of(generateMockUserContext());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
