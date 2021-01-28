import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as bulkExportJobsSchedulerActions from 'libs/features/jobs/bulk-job-description-export-scheduler/actions';
import * as fromJdmAdminReducer from 'libs/features/jobs/bulk-job-description-export-scheduler/reducers';
import { BulkExportSchedulerPageComponent } from './bulk-export-scheduler.page';


describe('Admin - Bulk Export Scheduler Page', () => {
  let fixture: ComponentFixture<BulkExportSchedulerPageComponent>;
  let instance: BulkExportSchedulerPageComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jdmAdmin: combineReducers(fromJdmAdminReducer.reducers)
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        BulkExportSchedulerPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(BulkExportSchedulerPageComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a load views action on init', () => {
    spyOn(bulkExportJobsSchedulerActions, 'LoadingViews');

    fixture.detectChanges();

    expect(bulkExportJobsSchedulerActions.LoadingViews).toHaveBeenCalled();
  });

  it('should dispatch a load filters action on init', () => {
    spyOn(bulkExportJobsSchedulerActions, 'LoadingFilters');

    fixture.detectChanges();

    expect(bulkExportJobsSchedulerActions.LoadingFilters).toHaveBeenCalled();
  });

  it('should dispatch a load schedules action on init', () => {
    spyOn(bulkExportJobsSchedulerActions, 'LoadingSchedules');

    fixture.detectChanges();

    expect(bulkExportJobsSchedulerActions.LoadingSchedules).toHaveBeenCalled();
  });
});
