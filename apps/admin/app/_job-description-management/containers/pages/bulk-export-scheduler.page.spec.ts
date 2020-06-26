import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromJdmReducer from '../../reducers';
import * as fromFilterActions from '../../actions/filter.actions';
import * as fromViewActions from '../../actions/view.actions';
import * as fromBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';
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
          jdmAdmin: combineReducers(fromJdmReducer.reducers)
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
    spyOn(fromViewActions, 'LoadingViews');

    fixture.detectChanges();

    expect(fromViewActions.LoadingViews).toHaveBeenCalled();
  });

  it('should dispatch a load filters action on init', () => {
    spyOn(fromFilterActions, 'LoadingFilters');

    fixture.detectChanges();

    expect(fromFilterActions.LoadingFilters).toHaveBeenCalled();
  });

  it('should dispatch a load schedules action on init', () => {
    spyOn(fromBulkExportScheduleActions, 'LoadingSchedules');

    fixture.detectChanges();

    expect(fromBulkExportScheduleActions.LoadingSchedules).toHaveBeenCalled();
  });
});
