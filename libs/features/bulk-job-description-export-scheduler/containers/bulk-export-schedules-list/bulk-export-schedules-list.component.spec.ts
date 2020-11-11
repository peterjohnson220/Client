import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core';

import * as fromBulkExportScheduleReducer from '../../reducers';
import * as fromBulkExportScheduleActions from '../../actions/bulk-export-schedule.actions';

import { BulkExportSchedulesListComponent } from './bulk-export-schedules-list.component';

describe('Bulk Job Description Export Scheduler - Bulk Export Schedule Form', () => {
  let fixture: ComponentFixture<BulkExportSchedulesListComponent>;
  let instance: BulkExportSchedulesListComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_bulk_jobs_export_scheduler: combineReducers(fromBulkExportScheduleReducer.reducers)
        }),
        FormsModule,
        PfCommonModule
      ],
      declarations: [
        BulkExportSchedulesListComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(BulkExportSchedulesListComponent);
    instance = fixture.componentInstance;
  });

  it('should call RemovingSchedule with a filename when removeSchedule is called', () => {
    const fileName = 'Test.xlsx';

    spyOn(fromBulkExportScheduleActions, 'RemovingSchedule');

    fixture.detectChanges();

    instance.removeSchedule(fileName);

    fixture.detectChanges();

    expect(fromBulkExportScheduleActions.RemovingSchedule).toHaveBeenCalledWith(fileName);
  });

});