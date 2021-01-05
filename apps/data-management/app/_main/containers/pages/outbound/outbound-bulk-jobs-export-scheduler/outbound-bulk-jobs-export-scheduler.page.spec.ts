import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as bulkExportJobsSchedulerActions from 'libs/features/jobs/bulk-job-description-export-scheduler/actions';
import * as fromJdmAdminReducer from 'libs/features/jobs/bulk-job-description-export-scheduler/reducers';

import { OutboundBulkJobsExportSchedulerPageComponent } from './outbound-bulk-jobs-export-scheduler.page';

describe('Data Management - Main - Outbound Bulk Jobs Export Scheduler Page', () => {
  let instance: OutboundBulkJobsExportSchedulerPageComponent;
  let fixture: ComponentFixture<OutboundBulkJobsExportSchedulerPageComponent>;
  let store: Store<fromJdmAdminReducer.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromJdmAdminReducer.reducers),
        }),
        RouterTestingModule.withRoutes([{
          path: '**',
          redirectTo: '',
        }]),
      ],
      providers: [],
      declarations: [
        OutboundBulkJobsExportSchedulerPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutboundBulkJobsExportSchedulerPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should dispatch a get connection summary action on init', () => {
    spyOn(store, 'dispatch');


    const expectedLoadFiltersAction = new bulkExportJobsSchedulerActions.LoadingFilters();
    const expectedLoadViewsAction = new bulkExportJobsSchedulerActions.LoadingViews();
    const expectedLoadBulkExportSchedulesAction = new bulkExportJobsSchedulerActions.LoadingSchedules();

    fixture.detectChanges();


    expect(store.dispatch).toHaveBeenCalledWith(expectedLoadFiltersAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedLoadViewsAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedLoadBulkExportSchedulesAction);
  });

});
